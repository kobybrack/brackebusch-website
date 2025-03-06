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
                {posts.map((post) => {
                    let postPreview = post.content
                        .replace(/(!?\[.*?\]\(.*?\)|[-*]\s|#+\s|>\s|```\s|__|[*_])/g, '')
                        .trim();
                    const truncatedPreview = postPreview.length > 75;
                    postPreview = postPreview.substring(0, 75).trim();
                    const postDateString = new Date(post.createdAt).toLocaleDateString('en-us', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                    return (
                        <div key={post.id} className="card card-bordered w-96 card-md shadow-sm">
                            <div className="card-body">
                                <Link href={`/posts/${post.postKey}`} className="no-underline">
                                    <h2 className="card-title m-0 link link-hover">{post.title}</h2>
                                </Link>
                                <p className="text-left m-0">{postPreview + (truncatedPreview ? '...' : '')}</p>
                                <p className="text-left text-sm text-base-content/25 m-0">{postDateString}</p>
                            </div>
                        </div>
                    );
                })}
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
