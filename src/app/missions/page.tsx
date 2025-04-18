import { auth, signOut } from '@/auth';
import LoadingSpinnerWithText from '@/components/LoadingSpinnerWithText';
import PostsList from '@/components/PostsList';
import dbClient from '@/lib/dbClient';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Missions() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login?redirectUrl=/missions');
    }

    const hasMissionAccess = session.user?.roles?.includes('missions');

    if (!hasMissionAccess) {
        return (
            <div className="flex flex-col justify-center items-center">
                You don't have access to this page.
                <br />
                If you think this is a mistake, please contact Koby.
            </div>
        );
    }

    const renderPostsList = async () => {
        const posts = await dbClient.getPosts(true);
        return <PostsList posts={posts} />;
    };
    const loadingText = 'Loading posts...';
    return <Suspense fallback={<LoadingSpinnerWithText loadingText={loadingText} />}>{renderPostsList()}</Suspense>;
}
