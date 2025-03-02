import { LoadingComponent } from '@/components/LoadingComponent';
import { PostComponent } from '@/components/PostComponent';
import { PostNavigationButtons } from '@/components/PostNavigationButtons';
import dbClient from '@/lib/dbClient';
import { Suspense, cache } from 'react';

// Dynamic posts page
export default async function Page({ params }: { params: Promise<{ postKey: string }> }) {
    const loadingText = 'Loading post...';
    const renderPost = async () => {
        const postKey = (await params).postKey;
        const result = await dbClient.getPostAndNearByPosts(postKey);
        if (result && result.post) {
            const { post, previous, next } = result;
            return (
                <div className="flex flex-col justify-between px-8 h-full">
                    <PostComponent post={post} />
                    <div className="flex flex-col text-sm text-base-content/25 w-full max-w-screen-md mx-auto">
                        {post.updatedAt !== post.createdAt && <span>Updated:</span>}
                        <span>
                            {new Date(post.createdAt).toLocaleDateString('en-us', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <PostNavigationButtons previousPost={previous} nextPost={next} />
                </div>
            );
        }
        return <div>Post not found</div>;
    };
    return <Suspense fallback={<LoadingComponent loadingText={loadingText} />}>{renderPost()}</Suspense>;
}
