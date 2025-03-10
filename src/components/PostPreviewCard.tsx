import { Post } from '@/lib/types';
import Link from 'next/link';

interface PostPreviewCardProps {
    post: Post;
}

export const PostPreviewCard = ({ post }: PostPreviewCardProps) => {
    let postPreview = post.content.replace(/(!?\[.*?\]\(.*?\)|[-*]\s|#+\s|>\s|```\s|__|[*_])/g, '').trim();
    const truncatedPreview = postPreview.length > 75;
    postPreview = postPreview.substring(0, 75).trim();
    const postDateString = new Date(post.createdAt).toLocaleDateString('en-us', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (
        <div key={post.id} className="card card-bordered card-md shadow-sm w-full">
            <div className="card-body">
                <Link href={`/posts/${post.postKey}`} className="no-underline">
                    <h2 className="card-title m-0 link link-hover">{post.title}</h2>
                </Link>
                <p className="text-left m-0">{postPreview + (truncatedPreview ? '...' : '')}</p>
                <p className="text-left text-sm text-base-content/25 m-0">{postDateString}</p>
            </div>
        </div>
    );
};
