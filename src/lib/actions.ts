'use server';

import { auth, signIn } from '@/auth';
import dbClient from '@/lib/dbClient';
import { handleAuthError, saltAndHashPassword } from '@/lib/authenticationHelpers';
import { generateUsername } from '@/lib/miscHelpers';
import { signInSchema } from '@/lib/types';
import microsoftGraphClient from './microsoftGraphClient';
import removeMd from 'remove-markdown';

export async function submitPost(formData: FormData) {
    try {
        const isMissionPost = formData.get('mission_post') === 'true';
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        formData.set('raw_text', title + removeMd(content));
        const trimmedTitle = title.trim();
        const postKey = trimmedTitle
            ? trimmedTitle
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-+|-+$/g, '')
                  .slice(0, 50)
            : `untitled-${Date.now()}`;
        formData.append('post_key', postKey);
        const post = await dbClient.upsertPost(formData);
        const emails = await dbClient.getUsersWhoWantEmails(isMissionPost);
        await microsoftGraphClient.sendPostEmails(emails, post);
        return post;
    } catch (error) {
        if (error instanceof Error) {
            return 'Something went wrong submitting the post: ' + error.message;
        }
    }
    // for type safety
    return null;
}

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

export async function updateUser(updateUserBody: any) {
    return dbClient.updateUser(updateUserBody);
}
