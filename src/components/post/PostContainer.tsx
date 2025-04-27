'use client';

import PostContent from '@/components/post/PostContent';
import PostNavigationButtons from '@/components/post/PostNavigationButtons';
import Comments from '@/components/post/Comments';
import { Post, User } from '@/lib/types';

interface PostContainerProps {
    post: Post;
    user: User | undefined;
    previous?: Post;
    next?: Post;
}

export default function PostContainer({ post, previous, next, user }: PostContainerProps) {
    return (
        <div className="flex flex-col max-w-(--breakpoint-md) mx-auto justify-between h-full">
            <div>
                <PostContent post={post} />
                <div className="flex flex-col text-sm text-base-content/25 w-full mt-2 mb-8">
                    {post.updatedAt !== post.createdAt && <span>Updated:</span>}
                    <span>
                        {new Date(post.createdAt).toLocaleDateString('en-us', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            </div>
            <div>
                <Comments postId={post.id} postKey={post.postKey} user={user} />
                <PostNavigationButtons previousPost={previous} nextPost={next} />
            </div>
        </div>
    );
}
