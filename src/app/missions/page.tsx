import { auth, signOut } from '@/auth';
import { LoadingSpinnerWithText } from '@/components/LoadingSpinnerWithText';
import { PostsList } from '@/components/PostsList';
import dbClient from '@/lib/dbClient';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
// import { nextAuthSignOut } from 'next-auth/react';

export default async function Page() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login?redirectUrl=/missions');
    }

    const hasMissionAccess = session.user?.roles?.includes('missions');

    if (!hasMissionAccess) {
        return <>you don't have access</>;
    }

    const renderPostsList = async () => {
        const posts = await dbClient.getPosts(true);
        return <PostsList posts={posts} />;
    };
    const loadingText = 'Loading posts...';
    return <Suspense fallback={<LoadingSpinnerWithText loadingText={loadingText} />}>{renderPostsList()}</Suspense>;
}
