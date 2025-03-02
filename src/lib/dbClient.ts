import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Post } from './types';

class DbClient {
    private client: NeonQueryFunction<false, false>;

    constructor() {
        this.client = neon(`${process.env.DATABASE_URL}`);
    }

    async getPostAndNearByPosts(postKey: string): Promise<Record<string, Post> | undefined> {
        const query = `
            WITH selected_post AS (
                SELECT *, 'post' AS position_label
                FROM posts
                WHERE post_key = $1
            ),
            previous_post AS (
                SELECT *, 'previous' AS position_label
                FROM posts
                WHERE id < (SELECT id FROM selected_post)
                ORDER BY id DESC
                LIMIT 1
            ),
            next_post AS (
                SELECT *, 'next' AS position_label
                FROM posts
                WHERE id > (SELECT id FROM selected_post)
                ORDER BY id ASC
                LIMIT 1
            )
            SELECT *
            FROM selected_post
            UNION ALL
            SELECT *
            FROM previous_post
            UNION ALL
            SELECT *
            FROM next_post`;
        const rows = await this.client(query, [postKey]);
        if (rows.length === 0) {
            return undefined;
        }
        const posts = rows.reduce((acc, row) => {
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
            acc[row.position_label] = post;
            return acc;
        }, {});
        return posts;
    }

    async getNextAndPreviousPosts(
        previousPostId: number,
        nextPostId: number,
    ): Promise<{ previousPost: Post | undefined; nextPost: Post | undefined }> {
        const ids = [previousPostId, nextPostId];
        const query = `SELECT * FROM posts WHERE id = ANY($1);`;
        const rows = await this.client(query, [ids]);
        return rows.reduce((acc, row) => {
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
            if (row.id === ids[0]) {
                acc.previousPost = post;
            } else if (row.id === ids[1]) {
                acc.nextPost = post;
            }

            return acc;
        }, {} as any);
    }

    async getPosts(): Promise<Post[]> {
        console.log('getting posts...');
        const query = 'SELECT * FROM posts ORDER BY created_at DESC';
        const rows = await this.client(query);
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
