'use client';

import { useState } from 'react';
import { useGetComments } from '@/hooks/commentHooks';
import LoadingSpinnerWithText from '../LoadingSpinnerWithText';
import { User } from '@/lib/types';
import Comment from '@/components/comments/Comment';
import CommentTextBox from './CommentTextBox';

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

    const [showAllComments, setShowAllComments] = useState(false);
    const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});
    const [showWriteReply, setShowWriteReply] = useState<Record<string, boolean>>({});

    return (
        <div className="flex flex-col gap-4 justify-start items-center w-full mb-8">
            <div className="divider font-bold">Comments</div>
            <CommentTextBox postId={postId} user={user} postKey={postKey} />
            {isLoading ? (
                <LoadingSpinnerWithText loadingText={'Loading comments...'} />
            ) : (
                comments &&
                comments.slice(0, showAllComments ? comments.length : INITIAL_COMMENTS_TO_SHOW).map((comment) => (
                    <div key={comment.id} className="w-full flex flex-col gap-2">
                        <Comment
                            comment={comment}
                            user={user}
                            setShowRepliesMap={setShowRepliesMap}
                            setShowTopWriteReply={setShowWriteReply}
                        />
                        {showRepliesMap[comment.id] && comment.replies.length > 0 && (
                            <div className="ml-12">
                                {showWriteReply[comment.id] && (
                                    <CommentTextBox
                                        postId={postId}
                                        user={user}
                                        postKey={postKey}
                                        closeReply={() =>
                                            setShowWriteReply((prev) => ({ ...prev, [comment.id]: false }))
                                        }
                                    />
                                )}
                                {comment.replies.map((reply) => (
                                    <Comment
                                        key={reply.id}
                                        comment={reply}
                                        user={user}
                                        setShowRepliesMap={setShowRepliesMap}
                                        setShowTopWriteReply={setShowWriteReply}
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
