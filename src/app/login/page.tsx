import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginPage } from '@/components/LoginPage';

export default async function Login() {
    const session = await auth();
    if (session?.user) {
        redirect('/');
    }
    return <LoginPage />;
}
