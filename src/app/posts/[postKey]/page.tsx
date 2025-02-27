import dbClient from '@/lib/dbClient';
import '@/app/globals.css';
import Markdown from 'react-markdown';
import commonStyles from '@/styles/posts.module.css';
import postStyles from '@/styles/posts.module.css';

export default async function Page({ params }: { params: Promise<{ postKey: string }> }) {
    const postKey = (await params).postKey;
    const post = await dbClient.getPostFromKey(postKey as string);
    return (
        <div className={`${commonStyles.markdownContainer} prose`}>
            <h1>{post.title}</h1>
            <Markdown>{post.content}</Markdown>
        </div>
    );
}
