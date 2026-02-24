import { Comment } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetComments(postId: string) {
    return useQuery<Comment[]>({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            return data.comments;
        },
    });
}

export function useSubmitComment(postId: string) {
    const queryClient = useQueryClient();

    const mutationResult = useMutation({
        mutationKey: ['submitComment', postId],
        mutationFn: async (formData: FormData) => {
            if (!postId || !formData) {
                throw new Error('Invalid input to submitComment');
            }
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                return 'Failed to submit comment';
            }

            const data = await response.json();
            queryClient.setQueryData(['comments', postId], (oldData: Comment[] = []) => {
                const { comment } = data;

                if (!comment.parentCommentId) {
                    return [comment, ...oldData];
                }

                return oldData.map((c) =>
                    c.id === comment.parentCommentId ? { ...c, replies: [...(c.replies || []), comment] } : c,
                );
            });
            return data.comment as Comment;
        },
    });

    return { submitComment: mutationResult.mutateAsync };
}

export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();

    const mutationResult = useMutation({
        mutationKey: ['deleteComment', postId],
        mutationFn: async (comment: Comment) => {
            const { id: commentId, parentCommentId, replies } = comment;
            if (!postId || !commentId) {
                throw new Error('Invalid input to deleteComment');
            }
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                return 'Failed to delete comment';
            }

            queryClient.setQueryData(['comments', postId], (oldData: Comment[] = []) => {
                return oldData.reduce<Comment[]>((acc, c) => {
                    // 1. Removing a reply from a parent
                    if (parentCommentId && c.id === parentCommentId) {
                        const updatedReplies = c.replies?.filter((r) => r.id !== commentId) || [];

                        // If parent is deleted AND no replies remain -> remove parent entirely
                        if (c.deletedAt && updatedReplies.length === 0) {
                            return acc; // skip pushing → parent removed
                        }

                        // Otherwise keep parent with updated replies
                        acc.push({
                            ...c,
                            replies: updatedReplies,
                        });

                        return acc;
                    }

                    // 2. Updating a comment that has replies
                    if (replies && replies.length > 0 && c.id === commentId) {
                        acc.push({ ...c, deletedAt: new Date().toISOString() });
                        return acc;
                    }

                    // 3. Removing a top-level comment
                    if (!parentCommentId && c.id === commentId) {
                        return acc; // skip it
                    }

                    // Default: keep comment unchanged
                    acc.push(c);
                    return acc;
                }, []);
            });
        },
    });

    return { deleteComment: mutationResult.mutateAsync };
}
