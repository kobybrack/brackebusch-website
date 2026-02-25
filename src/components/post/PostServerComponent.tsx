import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import { User } from '@/lib/types';
import { Suspense } from 'react';
import PostContainer from './PostContainer';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { redirect } from 'next/navigation';

export default async function PostServerComponent({
    postKey,
    missionPost,
}: {
    postKey: string;
    missionPost?: boolean;
}) {
    const session = await auth();
    const user = session?.user as User | undefined;
    if (missionPost && !user?.roles?.includes('missions')) {
        return (
            <div className="flex flex-col justify-center items-center">
                You don&apos;t have access to this page.
                <br />
                If you think this is a mistake, please contact Koby.
            </div>
        );
    }

    const loadingText = 'Loading post...';
    const result = await dbClient.getPostAndNearByPosts(postKey, missionPost);
    if (!result || !result.post) {
        return <div>Post not found</div>;
    }

    if (!missionPost && result.post.missionPost) {
        redirect(`/missions/${postKey}`);
    }

    if (missionPost && !result.post.missionPost) {
        redirect(`/posts/${postKey}`);
    }

    const { post, previous, next } = result;
    return (
        <Suspense fallback={<LoadingSpinnerWithText loadingText={loadingText} />}>
            <PostContainer post={post} previous={previous} next={next} user={user} />
        </Suspense>
    );
}
