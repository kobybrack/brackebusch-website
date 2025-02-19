import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Post } from './types';

class DbClient {
    private client: NeonQueryFunction<false, false>;

    constructor() {
        this.client = neon(`${process.env.DATABASE_URL}`);
    }

    async getPostFromKey(postKey: string): Promise<Post> {
        const query = 'SELECT * FROM posts WHERE post_key = $1;';
        const rows = await this.client(query, [postKey]);
        if (rows.length === 0) {
            throw new Error('Post not found');
        }
        const row = rows[0];
        const post: Post = {
            id: row.id,
            title: row.title,
            content: row.content,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
            contentType: row.content_type,
            rawText: row.raw_text,
            postKey: row.post_key,
        };
        return post;
    }

    async getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
        const query = 'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2;';
        const rows = await this.client(query, [limit, offset]);
        return rows.map((row) => {
            const post: Post = {
                id: row.id,
                title: row.title,
                content: row.content,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                contentType: row.content_type,
                rawText: row.raw_text,
                postKey: row.post_key,
            };
            return post;
        });
    }
}

const dbClient = new DbClient();
export default dbClient;
