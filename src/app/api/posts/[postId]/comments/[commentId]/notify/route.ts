import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import microsoftGraphClient from '@/lib/microsoftGraphClient';

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }

    const { postId } = await params;
    const { parentCommentId } = (await request.json()) as { parentCommentId?: string };

    const [post, parentComment] = await Promise.all([
        dbClient.getPostById(postId),
        dbClient.getCommentById(parentCommentId),
    ]);

    const emailPromises = [];

    if (parentComment && post) {
        emailPromises.push(microsoftGraphClient.sendCommentReplyEmail(parentComment.userData.email!, post));
    }

    if (post) {
        emailPromises.push(microsoftGraphClient.sendCommentEmail(post));
    }

    await Promise.all(emailPromises);
    return new Response(null, { status: 202 });
}
