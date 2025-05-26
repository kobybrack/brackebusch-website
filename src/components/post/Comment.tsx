import { Comment as CommentType, User } from '@/lib/types';
import { timeAgo } from '@/lib/miscHelpers';
import { useDeleteComment, useSubmitComment } from '@/hooks/commentHooks';
import { useState } from 'react';

export default function CommentComponent({
    comment,
    user,
    setShowRepliesMap,
}: {
    comment: CommentType;
    user: User | undefined;
    setShowRepliesMap: (prev: any) => void;
}) {
    const { deleteComment } = useDeleteComment(comment.postId);
    const { submitComment } = useSubmitComment(comment.postId);

    const [isFocused, setIsFocused] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [content, setContent] = useState('');

    return (
        <div className="bg-base-200 border-base-300 rounded-box p-4">
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">
                            {comment.userData.firstName
                                ? comment.userData.firstName + ' ' + (comment.userData.lastName?.slice(0, 1) || '')
                                : comment.userData.username}
                        </span>
                        <span className="text-base-content/25 text-sm">
                            {(comment.updatedAt !== comment.createdAt ? 'edited:' : '') + ' '}
                            {timeAgo(comment.updatedAt)}
                        </span>
                    </div>
                    <div>
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
                </div>
                <p>{comment.content}</p>
                {!comment.parentCommentId && (
                    <div className="flex justify-start items-center">
                        <div>
                            <button className="btn btn-sm w-[60px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5 shrink-0"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                                2
                            </button>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm w-[60px]"
                                onClick={() =>
                                    setShowRepliesMap((prev: any) => ({
                                        ...prev,
                                        [comment.id]: !prev[comment.id],
                                    }))
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5 shrink-0"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                    />
                                </svg>
                                36
                                {comment.replies.length || ''}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
