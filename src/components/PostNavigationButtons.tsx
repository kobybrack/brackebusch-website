import { Post } from '@/lib/types';
import Link from 'next/link';

interface PostNavigationButtonsProps {
    previousPost: Post | undefined;
    nextPost: Post | undefined;
}

export const PostNavigationButtons = ({ previousPost, nextPost }: PostNavigationButtonsProps) => {
    const renderButton = (post: Post | undefined, label: string) => {
        const button = (
            <div className="tooltip hover:after:delay-500 hover:before:delay-500" data-tip={post?.title}>
                <button className={`btn w-[90px] ${post ? '' : 'btn-disabled'}`}>{label}</button>
            </div>
        );
        return post ? <Link href={`/posts/${post.postKey}`}>{button}</Link> : button;
    };

    const previousButton = renderButton(previousPost, 'Previous');
    const nextButton = renderButton(nextPost, 'Next');

    return (
        <div className="flex justify-center gap-10 h-[50px]">
            {previousButton}
            {nextButton}
        </div>
    );
};
