import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';
import microsoftGraphClient from '@/lib/microsoftGraphClient';

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const comments = await dbClient.getComments(postId);
    return Response.json({ comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }
    const userId = session.user.id as string;
    const { postId } = await params;
    const formData = await request.formData();
    const content = formData.get('content') as string;

    if (!postId || !content || !userId) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await dbClient.insertComment(postId, userId, content);
    setTimeout(() => getPostAndSendCommentEmail(postId), 0);
    return Response.json({ comment });
}

async function getPostAndSendCommentEmail(postId: string) {
    const post = await dbClient.getPostFromId(postId);
    if (post) {
        await microsoftGraphClient.sendCommentEmail(post);
    }
}
