import { Post } from '@/lib/types';
import Link from 'next/link';

export default function PostPreviewCard({ post }: { post: Post }) {
    let postPreview = post.content.replace(/(^#{1,6} |\*\*|__|\*|_)/g, '').trim();
    const truncatedPreview = postPreview.length > 75;
    postPreview = postPreview.substring(0, 100).trim();
    const postDateString = new Date(post.createdAt).toLocaleDateString('en-us', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (
        <Link key={post.id} href={`/posts/${post.postKey}`} className="w-full no-underline">
            <div className="card card-border shadow-xs w-full hover:bg-base-200">
                <div className="card-body">
                    <h2 className="card-title !m-0">{post.title}</h2>
                    <p className="text-left !m-0">{postPreview + (truncatedPreview ? '...' : '')}</p>
                    <p className="text-left text-sm text-base-content/25 !m-0">{postDateString}</p>
                </div>
            </div>
        </Link>
    );
}
