import { Comment as CommentType, User } from '@/lib/types';
import { timeAgo } from '@/lib/miscHelpers';
import { useDeleteComment, useSubmitComment } from '@/hooks/commentHooks';
import { useState } from 'react';
import { set } from 'zod';

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

    const [writeReply, setWriteReply] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [content, setContent] = useState('');

    return (
        <div>
            <div className="bg-base-200 rounded-box p-4">
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
                    <div className="flex justify-start items-center gap-1 h-[30px]">
                        <div className="flex flex-row items-center gap-1">
                            <button className="btn btn-sm btn-square">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="none"
                                    className={`size-5 shrink-0 ${true ? 'stroke-accent fill-accent' : 'stroke-error fill-error'}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                            </button>
                            <span className="w-[20px] text-center text-sm">
                                {Math.floor((Math.random() * 1000) / 9)}
                            </span>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={() => setWriteReply((prev) => !prev)}>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
            {comment.replies.length > 0 && (
                <button
                    className="btn btn-ghost btn-sm mt-2"
                    onClick={() =>
                        setShowRepliesMap((prev: any) => ({
                            ...prev,
                            [comment.id]: !prev[comment.id],
                        }))
                    }
                >{`View ${comment.replies.length} ${comment.replies.length > 1 ? 'replies' : 'reply'}`}</button>
            )}
            {writeReply && (
                <textarea
                    className={`textarea w-98/100 [field-sizing:content] m-2 !min-h-[4rem] ${isFocused || !cancelled ? '' : ''}`}
                    style={{ resize: 'none' }}
                    placeholder={'Write your reply...'}
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
            )}
        </div>
    );
}
