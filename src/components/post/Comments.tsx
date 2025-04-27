'use client';

import Link from 'next/link';
import { timeAgo } from '@/lib/miscHelpers';
import { useActionState, useState } from 'react';
import { useDeleteComment, useGetComments, useSubmitComment } from '@/hooks/commentHooks';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { User } from '@/lib/types';
import useResettableActionState from '@/hooks/useResettableActionState';

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
    const { deleteComment } = useDeleteComment(postId);

    const [isFocused, setIsFocused] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [content, setContent] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);

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
                    <div key={comment.id} className="bg-base-200 border-base-300 rounded-box p-4 w-full">
                        <div key={comment.id} className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <span className="font-bold">
                                        {comment.userData.firstName
                                            ? comment.userData.firstName +
                                              ' ' +
                                              (comment.userData.lastName?.slice(0, 1) || '')
                                            : comment.userData.username}
                                    </span>
                                    <span className="text-base-content/25 text-sm">
                                        {(comment.updatedAt !== comment.createdAt ? 'edited:' : '') + ' '}
                                        {timeAgo(comment.updatedAt)}
                                    </span>
                                </div>
                                {(user?.id === comment.userData.userId || user?.roles?.includes('admin')) && (
                                    <div className="dropdown dropdown-left">
                                        <div role="button" className="btn btn-ghost btn-square btn-sm" tabIndex={0}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 shadow-sm"
                                        >
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        (document.activeElement as any).blur();
                                                        deleteComment(comment.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <p>{comment.content}</p>
                        </div>
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
