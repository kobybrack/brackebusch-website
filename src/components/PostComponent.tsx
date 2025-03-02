import Markdown from 'react-markdown';
import { Post } from '@/lib/types';

type PostComponentProps = {
    post: Post;
};

export const PostComponent = ({ post }: PostComponentProps) => {
    return (
        <div className="flex-grow w-full max-w-screen-md mx-auto">
            <div className="prose mx-auto">
                <h1>{post.title}</h1>
                <Markdown children={post.content} />
            </div>
        </div>
    );
};
