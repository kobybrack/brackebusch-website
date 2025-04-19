import { signOut as logOut, auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LogOut() {
    const session = await auth();
    if (!session?.user) {
        redirect('/');
    }

    return (
        <form
            className="flex flex-col justify-center gap-4 max-w-xs mx-auto"
            action={async () => {
                'use server';
                await logOut({ redirectTo: '/' });
            }}
        >
            <div role="alert" className="alert alert-warning">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span className="">Are you sure you want to log out?</span>
            </div>
            <button className="btn" type="submit">
                Log out
            </button>
        </form>
    );
}
