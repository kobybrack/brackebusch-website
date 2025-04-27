import type { NextAuthConfig, Profile } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/lib/types';
import { checkPassword } from '@/lib/authenticationHelpers';
import dbClient from '@/lib/dbClient';
import { generateUsername, getEffectiveRoles } from './lib/miscHelpers';
import Google from 'next-auth/providers/google';
import MicrosoftEntraId from 'next-auth/providers/microsoft-entra-id';
import GitHub, { GitHubProfile } from 'next-auth/providers/github';

const profile = async (profile: Profile | GitHubProfile) => {
    const email = profile.email;

    if (!email) {
        throw new Error("OAuth profile doesn't contain an email");
    }

    const user = await dbClient.getUserAndRoles(email);
    if (user) {
        return {
            ...user,
            customId: user.id,
        };
    }
    const [firstName, lastName] = profile.name?.split(' ') || [];

    // user does not exist, create a new user
    const username = generateUsername(email);
    const createdUser = await dbClient.createUser({ email, username, firstName, lastName });

    return {
        ...createdUser,
        customId: createdUser.id,
    };
};

export default {
    pages: {
        signIn: '/login',
        signOut: '/logout',
    },
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const parseResult = await signInSchema.safeParseAsync(credentials);
                if (parseResult.success) {
                    const { email, password } = parseResult.data;

                    const user = await dbClient.getUserAndRoles(email, true);
                    if (!user || !(await checkPassword(password, user.password || ''))) {
                        return null;
                    }
                    delete user.password;
                    return user;
                }
                return null;
            },
        }),
        Google({
            profile,
        }),
        MicrosoftEntraId({
            profile,
        }),
        GitHub({
            profile,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user.customId ? user.customId : user.id) || '';
                token.roles = getEffectiveRoles(user.roles || []);
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id || '';
            session.user.roles = token.roles;
            return session;
        },
    },
} satisfies NextAuthConfig;
