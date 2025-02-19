import dbClient from '@/lib/dbClient';
import '@/app/globals.css';
import Markdown from 'react-markdown';
import commonStyles from '@/styles/posts.module.css';
import postStyles from '@/styles/posts.module.css';

const otherMarkdown = '# This is some other markdown';

export default async function Page({ params }: { params: Promise<{ postKey: string }> }) {
    const postKey = (await params).postKey;
    const post = await dbClient.getPostFromKey(postKey as string);
    console.log(post.content);
    return (
        <div className={commonStyles.markdownContainer}>
            <h1 className={postStyles.postsHeaderText}>{post.title}</h1>
            <Markdown>{post.content}</Markdown>
        </div>
    );
}
