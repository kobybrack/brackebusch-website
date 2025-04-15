'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import dbClient from './dbClient';
import { saltAndHashPassword } from '@/lib/authenticationHelpers';
import { generateUsername } from './miscHelpers';

export async function login(_prevState: string | undefined, formData: FormData) {
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
}

export async function signOutAction() {
    await signOut({ redirect: false });
}

export async function createEmailUser(_prevState: string | undefined, formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const username = generateUsername(email);
        const password = formData.get('password') as string;
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
        throw error;
        // if (error instanceof Error && error.message.includes('already exists')) {
        //     return error.message;
        // }
        // console.log(error);
        // return 'Something went wrong :(';
    }
}

// export async
