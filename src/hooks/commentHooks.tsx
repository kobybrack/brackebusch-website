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
        },
    });

    return { submitComment: mutationResult.mutateAsync };
}

export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();

    const mutationResult = useMutation({
        mutationKey: ['deleteComment', postId],
        mutationFn: async (commentId: string) => {
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
                return oldData.filter((comment) => comment.id !== commentId);
            });
        },
    });

    return { deleteComment: mutationResult.mutateAsync };
}
