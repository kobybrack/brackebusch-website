import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpPage from '@/components/SignUpPage';

export default async function SignUp() {
    const session = await auth();
    if (session?.user) {
        redirect('/');
    }
    return <SignUpPage />;
}
