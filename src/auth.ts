import NextAuth, { type DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { User as MyUserType } from './lib/types';

declare module 'next-auth' {
    interface User extends MyUserType {
        customId?: string;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        id: string;
        roles?: string[];
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth(() => {
    return {
        // session: {
        //     strategy: 'jwt',
        // },
        ...authConfig,
    };
});
