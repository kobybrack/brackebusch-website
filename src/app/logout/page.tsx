import { signOut as logOut } from '@/auth';

export default function LogOut() {
    return (
        <form
            className="flex justify-center"
            action={async () => {
                'use server';
                await logOut({ redirectTo: '/' });
            }}
        >
            <button className="btn" type="submit">
                Log out
            </button>
        </form>
    );
}
