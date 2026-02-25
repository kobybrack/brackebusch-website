import { useSubmitComment } from '@/hooks/commentHooks';
import useResettableActionState from '@/hooks/useResettableActionState';
import { User } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CommentTextBox({
    postId,
    user,
    postKey,
    closeReplyTextbox,
    openReplies,
    parentCommentId,
}: {
    postId: string;
    user: User | undefined;
    postKey: string;
    closeReplyTextbox: () => void;
    openReplies: () => void;
    parentCommentId?: string;
}) {
    const { submitComment } = useSubmitComment(postId);
    const handleSubmit = async (_: unknown, formData: FormData) => {
        try {
            const { id: submittedCommentId } = await submitComment(formData);

            setContent('');
            closeReplyTextbox();
            openReplies();

            setTimeout(() => {
                document
                    .getElementById(`comment-${submittedCommentId}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            fetch(`/api/posts/${postId}/comments/${submittedCommentId}/notify`, {
                method: 'POST',
                body: JSON.stringify({ parentCommentId }),
                keepalive: true,
            }).catch(console.error);
        } catch (error) {
            console.error(error);
            return 'Failed to submit comment';
        }
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(handleSubmit, null);

    const [isFocused, setIsFocused] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [content, setContent] = useState('');

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current as HTMLTextAreaElement | null;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const textAreaPlaceHolder = user ? 'Write a comment!' : 'Log in to comment!';

    return (
        <form className="w-full flex flex-col justify-start gap-4" action={formAction}>
            {parentCommentId && <input type="hidden" name="parent_comment_id" value={parentCommentId} />}
            <div>
                <textarea
                    ref={textareaRef}
                    className={`textarea w-full mb-4 !min-h-[4rem] overflow-hidden ${isFocused || !cancelled ? '' : ''}`}
                    style={{ resize: 'none' }}
                    placeholder={textAreaPlaceHolder}
                    disabled={!user}
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => {
                        setIsFocused(true);
                        setCancelled(false);
                    }}
                    onBlur={(e) => {
                        if (e.relatedTarget && e.relatedTarget.tagName === 'BUTTON') {
                            return;
                        }
                        setIsFocused(false);
                    }}
                />
                <div className={`${errorMessage ? 'flex justify-between items-center' : ''} mb-4`}>
                    {errorMessage && <span className="text-sm text-error">{errorMessage}</span>}
                    {user ? (
                        <div className="flex justify-end gap-2">
                            {(content || parentCommentId) && (
                                <button
                                    type="button"
                                    className={`btn btn-sm btn-ghost`}
                                    onClick={() => {
                                        setCancelled(true);
                                        setContent('');
                                        reset();
                                        if (closeReplyTextbox) closeReplyTextbox();
                                    }}
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="btn btn-sm btn-primary" disabled={!content || isPending}>
                                {!isPending ? 'Comment' : 'Commenting...'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-2">
                            <Link href={`/login?redirectUrl=/posts/${postKey}`}>
                                <button type="button" className="btn btn-primary">
                                    Log in
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
