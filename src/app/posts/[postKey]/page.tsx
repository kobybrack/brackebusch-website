import dbClient from '@/lib/dbClient';
import '@/app/globals.css';
import Markdown from 'react-markdown';
import commonStyles from '@/styles/posts.module.css';

const otherMarkdown = '# This is some other markdown';

export default async function Page({ params }: { params: Promise<{ postKey: string }> }) {
    const postKey = (await params).postKey;
    const post = await dbClient.getPostFromKey(postKey as string);
    return (
        <div className={commonStyles.markdownContainer}>
            <Markdown>{post.content}</Markdown>
        </div>
    );
}
