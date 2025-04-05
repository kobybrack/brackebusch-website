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
                rawText: row.raw_text,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                contentType: row.content_type,
                postKey: row.post_key,
            };
            acc[row.position_label] = post;
            return acc;
        }, {});
        return posts;
    }

    async getPosts(): Promise<Post[]> {
        const query = 'SELECT * FROM posts ORDER BY created_at DESC';
        const rows = await this.client(query);
        return rows.map((row) => {
            const post: Post = {
                id: row.id,
                title: row.title,
                content: row.content,
                rawText: row.raw_text,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                contentType: row.content_type,
                postKey: row.post_key,
            };
            return post;
        });
    }

    async getLatestPosts(): Promise<Post[]> {
        const query = `
            SELECT *
            FROM posts
            ORDER BY id DESC
            LIMIT 3`;
        const rows = await this.client(query);
        if (!rows.length) {
            throw new Error('no posts in database!');
        }
        return rows.map((row) => {
            const post: Post = {
                id: row.id,
                title: row.title,
                content: row.content,
                rawText: row.raw_text,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                contentType: row.content_type,
                postKey: row.post_key,
            };
            return post;
        });
    }

    async upsertPost(formData: FormData): Promise<Post> {
        if (!formData.get('id')) {
            return await this.insertPost(formData);
        }
        return await this.updatePost(formData);
    }

    async insertPost(formData: FormData): Promise<Post> {
        const query = `
            INSERT INTO posts (title, content, content_type, post_key, missionary_post)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const contentType = formData.get('content_type') as string;
        const postKey = formData.get('post_key') as string;
        const missionaryPost = formData.get('missionary_post') === 'true';

        const rows = await this.client(query, [title, content, contentType, postKey, missionaryPost]);
        const row = rows[0];
        const post: Post = {
            id: row.id,
            title: row.title,
            content: row.content,
            rawText: row.raw_text,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
            contentType: row.content_type,
            postKey: row.post_key,
        };
        return post;
    }

    async updatePost(formData: FormData): Promise<Post> {
        const query = `
            UPDATE posts
            SET title = $1, content = $2, content_type = $3, post_key = $4, missionary_post = $5
            WHERE id = $6
            RETURNING *`;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const contentType = formData.get('content_type') as string;
        const postKey = formData.get('post_key') as string;
        const missionaryPost = formData.get('missionary_post') === 'true';
        const id = parseInt(formData.get('id') as string, 10);

        const rows = await this.client(query, [title, content, contentType, postKey, missionaryPost, id]);
        const row = rows[0];
        const post: Post = {
            id: row.id,
            title: row.title,
            content: row.content,
            rawText: row.raw_text,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
            contentType: row.content_type,
            postKey: row.post_key,
        };
        return post;
    }
}

const dbClient = new DbClient();
export default dbClient;
