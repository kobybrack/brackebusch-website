'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import dbClient from './dbClient';
import { saltAndHashPassword } from '@/lib/authenticationHelpers';
import { generateUsername } from './miscHelpers';
import { signInSchema } from '@/lib/types';

export async function login(_: string | null, formData: FormData) {
    try {
        const loginMethod = formData.get('loginMethod') as string;
        await signIn(loginMethod, formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid username or password';
                default:
                    return 'Something went wrong :(';
            }
        }
        throw error;
    }
    return null;
}

export async function createEmailUser(_: string | undefined, formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const verifySignInSchema = signInSchema.safeParse({
            email,
            password,
        });
        if (!verifySignInSchema.success) {
            throw new Error('Invalid format');
        }
        const username = generateUsername(email);
        const saltedHashedPassword = await saltAndHashPassword(password);
        await dbClient.createUser({ email, password: saltedHashedPassword, username });
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid username or password';
                default:
                    return 'Something went wrong :(';
            }
        }
        if (error instanceof Error && error.message.includes('invalid format')) {
            return 'Invalid username or password';
        }

        throw error;
    }
}
