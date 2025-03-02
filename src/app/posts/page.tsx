import { LoadingComponent } from '@/components/LoadingComponent';
import dbClient from '@/lib/dbClient';
import Link from 'next/link';
import { cache, Suspense } from 'react';

// Posts list page
export default async function Page() {
    const renderPostsList = async () => {
        const posts = await dbClient.getPosts();
        return (
            <div className="flex flex-col justify-center items-center gap-[20px]">
                {posts.map((post) => (
                    <Link key={post.id} href={`/posts/${post.postKey}`}>
                        <button className="btn">{post.title}</button>
                    </Link>
                ))}
            </div>
        );
    };
    const loadingText = 'Loading posts...';
    return (
        <div className="flex flex-col justify-center items-center px-4 sm:px-8 lg:px-8 w-full">
            <div className="prose mx-auto text-center">
                <h1>Recent posts:</h1>
                <Suspense fallback={<LoadingComponent loadingText={loadingText} />}>{renderPostsList()}</Suspense>
            </div>
        </div>
    );
}
