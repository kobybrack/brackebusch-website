import bcrypt from 'bcrypt';

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
        // Compare the plaintext password with the hashed password
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);

        return match; // Returns true if the password matches, false otherwise
    } catch (err) {
        console.error('Error checking password:', err);
        throw err;
    }
}
