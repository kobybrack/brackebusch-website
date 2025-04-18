import { auth } from '@/auth';
import { Navbar } from '@/components/Navbar';

export async function ServerNavbarWrapper() {
    const session = await auth();
    return <Navbar loggedIn={!!session?.user} roles={session?.user?.roles || []} />;
}
