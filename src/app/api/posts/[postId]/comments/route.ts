import { auth } from '@/auth';
import dbClient from '@/lib/dbClient';

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const comments = await dbClient.getComments(postId);
    return Response.json({ comments });
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return Response.json('only users with accounts can write comments', { status: 403 });
    }
    const formData = await request.formData();
    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;

    if (!postId || !content || !userId) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await dbClient.insertComment(postId, userId, content);
    return Response.json({ comment });
}
