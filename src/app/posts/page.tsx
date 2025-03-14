import { LoadingSpinnerWithText } from '@/components/LoadingSpinnerWithText';
import { PostsList } from '@/components/PostsList';
import dbClient from '@/lib/dbClient';
import { Suspense } from 'react';

// Posts list page
export default function Page() {
    const renderPostsList = async () => {
        const posts = await dbClient.getPosts();
        return <PostsList posts={posts} />;
    };
    const loadingText = 'Loading posts...';
    return <Suspense fallback={<LoadingSpinnerWithText loadingText={loadingText} />}>{renderPostsList()}</Suspense>;
}
