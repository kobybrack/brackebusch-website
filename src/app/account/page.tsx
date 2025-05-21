import { auth } from '@/auth';
import AccountClientComponent from '@/components/AccountPage';
import dbClient from '@/lib/dbClient';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default async function AccountServerComponent() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login?redirectUrl=/account');
    }
    const user = await dbClient.getUserAndRoles(session.user.email || '');
    if (!user) {
        throw new Error('no user found during account page!');
    }

    return (
        <SessionProvider session={session}>
            <AccountClientComponent initialUser={user} />;
        </SessionProvider>
    );
}
