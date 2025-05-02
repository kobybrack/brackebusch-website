import { auth } from '@/auth';
import PostEditor from '@/components/PostEditor';
import { redirect } from 'next/navigation';

export default async function EditorServerComponent() {
    const session = await auth();
    if (!session?.user || !session.user.roles?.includes('editor')) {
        redirect('/');
    }

    return <PostEditor />;
}
