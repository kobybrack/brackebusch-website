'use client';

import Link from 'next/link';
import { timeAgo } from '@/lib/miscHelpers';
import { useActionState, useState } from 'react';
import { useDeleteComment, useGetComments, useSubmitComment } from '@/hooks/commentHooks';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { User } from '@/lib/types';
import useResettableActionState from '@/hooks/useResettableActionState';
import Comment from '@/components/post/Comment';

const INITIAL_COMMENTS_TO_SHOW = 4;

export default function Comments({
    postId,
    postKey,
    user,
}: {
    postId: string;
    postKey: string;
    user: User | undefined;
}) {
    const { data: comments, isLoading } = useGetComments(postId);
    const { submitComment } = useSubmitComment(postId);

    const [isFocused, setIsFocused] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [content, setContent] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});

    const handleSubmit = async (_: any, formData: FormData) => {
        const error = await submitComment(formData);
        if (error) {
            return error;
        }
        setContent('');
    };

    const [errorMessage, formAction, isPending, reset] = useResettableActionState(handleSubmit, null);

    const textAreaPlaceHolder = user ? 'Write a comment!' : 'Log in to comment!';

    return (
        <div className="flex flex-col gap-4 justify-start items-center w-full mb-8">
            <div className="divider font-bold">Comments</div>
            <form className="w-full flex flex-col justify-start gap-4" action={formAction}>
                <div>
                    <textarea
                        className={`textarea w-full [field-sizing:content] mb-4 !min-h-[4rem] ${isFocused || !cancelled ? '' : ''}`}
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
                    <div className={errorMessage ? 'flex justify-between items-center' : ''}>
                        {errorMessage && <span className="text-sm text-error">{errorMessage}</span>}
                        {user ? (
                            <div className="flex justify-end gap-2">
                                {content && (
                                    <button
                                        type="button"
                                        className={`btn btn-sm btn-ghost`}
                                        onClick={() => {
                                            setCancelled(true);
                                            setContent('');
                                            reset();
                                        }}
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-primary"
                                    disabled={!content || isPending}
                                >
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
            {isLoading ? (
                <LoadingSpinnerWithText loadingText={'Loading comments...'} />
            ) : (
                comments &&
                comments.slice(0, showAllComments ? comments.length : INITIAL_COMMENTS_TO_SHOW).map((comment) => (
                    <div key={comment.id} className="w-full flex flex-col gap-4">
                        <Comment comment={comment} user={user} setShowRepliesMap={setShowRepliesMap} />
                        {showRepliesMap[comment.id] && comment.replies.length > 0 && (
                            <div className="ml-8 pl-8">
                                <textarea className="textarea w-full [field-sizing:content] mb-4 !min-h-[4rem]" />
                                {comment.replies.map((reply) => (
                                    <Comment
                                        key={reply.id}
                                        comment={reply}
                                        user={user}
                                        setShowRepliesMap={setShowRepliesMap}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
            {comments && comments.length > INITIAL_COMMENTS_TO_SHOW && (
                <div className="flex justify-start">
                    {showAllComments ? (
                        <button className="btn btn-sm btn-ghost" onClick={() => setShowAllComments((prev) => !prev)}>
                            Show less
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-ghost" onClick={() => setShowAllComments((prev) => !prev)}>
                            Show all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
