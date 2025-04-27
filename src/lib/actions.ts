'use server';

import { auth, signIn } from '@/auth';
import dbClient from '@/lib/dbClient';
import { handleAuthError, saltAndHashPassword } from '@/lib/authenticationHelpers';
import { generateUsername } from '@/lib/miscHelpers';
import { signInSchema } from '@/lib/types';

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

export async function submitComment(formData: FormData) {
    const session = await auth();
    const content = formData.get('content') as string;
    const postId = formData.get('postId') as string;
    await dbClient.insertComment(postId, session?.user?.id as string, content);
}
