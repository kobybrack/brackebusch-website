'use server';

import { signIn } from '@/auth';
import dbClient from './dbClient';
import { handleAuthError, saltAndHashPassword } from '@/lib/authenticationHelpers';
import { generateUsername } from './miscHelpers';
import { signInSchema } from '@/lib/types';

export const submitPost = async (formData: FormData) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a delay
    // return;
    return dbClient.upsertPost(formData);
};

export async function login(_: string | null, formData: FormData) {
    try {
        const loginMethod = formData.get('loginMethod') as string;
        await signIn(loginMethod, formData);
    } catch (error) {
        handleAuthError(error);
    }
    // for type safety
    return null;
}

export async function createEmailUser(_: string | null, formData: FormData) {
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
        handleAuthError(error);
    }
    // for type safety
    return null;
}
