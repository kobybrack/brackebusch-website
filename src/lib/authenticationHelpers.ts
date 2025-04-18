import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';

const saltRounds = 10;
export async function saltAndHashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

export async function checkPassword(plainTextPassword: string, hashedPassword: string) {
    try {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (err) {
        console.error('Error checking password:', err);
        throw err;
    }
}

export function handleAuthError(error: unknown) {
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
