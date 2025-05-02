import { object, string } from 'zod';
export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    contentType: string;
    rawText: string;
    postKey: string;
    missionPost: string;
}
export interface User {
    id: string;
    email: string;
    password?: string;
    username: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
}
export interface Comment {
    id: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    userData: {
        userId: string;
        firstName?: string;
        lastName?: string;
        username: string;
    };
}

export const signInSchema = object({
    email: string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email'),
    password: string({ required_error: 'Password is required' }).regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        'Password must be more than 8 characters, including number, lowercase letter, uppercase letter',
    ),
});
