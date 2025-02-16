import pg from 'pg';
import { Post } from './types';

const config = {
    host: 'brackebusch-web-db.postgres.database.azure.com',
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    port: 5432,
    ssl: true,
};

class DbClient {
    private client: pg.Client;

    constructor() {
        this.client = new pg.Client(config);
        this.client.connect((err) => {
            if (err) throw err;
        });
    }

    async getPostFromKey(postKey: string): Promise<Post> {
        const query = 'SELECT * FROM posts WHERE post_key = $1;';
        const res = await this.client.query(query, [postKey]);
        const rows = res.rows;
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
        const res = await this.client.query(query, [limit, offset]);
        const rows = res.rows;
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
