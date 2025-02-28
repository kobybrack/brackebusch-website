import dbClient from '@/lib/dbClient';
import Markdown from 'react-markdown';

// Dynamic posts page
export default async function Page({ params }: { params: Promise<{ postKey: string }> }) {
    const postKey = (await params).postKey;
    const post = await dbClient.getPostFromKey(postKey as string);
    return (
        <div className="w-full px-8">
            <div className="prose mx-auto">
                <h1>{post.title}</h1>
                <Markdown>{post.content}</Markdown>
            </div>
        </div>
    );
}
