import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpPage from '@/components/SignUpPage';

export default async function Page() {
    const session = await auth();
    if (session?.user) {
        redirect('/');
    }
    return <SignUpPage />;
}
