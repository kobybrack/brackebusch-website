import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Post, User, Comment } from './types';

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
            FROM next_post
        `;

        const rows = await this.client(query, [postKey]);
        if (rows.length === 0) {
            return undefined;
        }

        const posts = rows.reduce((acc, row) => {
            const post: Post = {
                id: row.id,
                postKey: row.post_key,
                title: row.title,
                content: row.content,
                rawText: row.raw_text,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                contentType: row.content_type,
                missionPost: row.mission_post,
            };
            acc[row.position_label] = post;
            return acc;
        }, {});

        return posts;
    }

    async getPosts(missionPosts = false): Promise<Post[]> {
        const query = `
            SELECT * 
            FROM posts 
            WHERE mission_post = ${missionPosts} 
            ORDER BY id DESC`;
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
                missionPost: row.mission_post,
            };
            return post;
        });
    }

    async getLatestPosts(hasMissionsAccess = false): Promise<Post[]> {
        const query = `
            SELECT *
            FROM posts
            ${!hasMissionsAccess ? 'WHERE mission_post = false' : ''}
            ORDER BY id DESC
            LIMIT 3`;
        const rows = await this.client(query);
        return rows.map((row) => {
            const post: Post = {
                id: row.id,
                postKey: row.post_key,
                title: row.title,
                content: row.content,
                rawText: row.raw_text,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                contentType: row.content_type,
                missionPost: row.mission_post,
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
            INSERT INTO posts (title, content, content_type, post_key, mission_post)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const contentType = formData.get('content_type') as string;
        const postKey = formData.get('post_key') as string;
        const missionPost = formData.get('mission_post') === 'true';

        const rows = await this.client(query, [title, content, contentType, postKey, missionPost]);
        const row = rows[0];
        const post: Post = {
            id: row.id,
            postKey: row.post_key,
            title: row.title,
            content: row.content,
            rawText: row.raw_text,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            contentType: row.content_type,
            missionPost: row.mission_post,
        };
        return post;
    }

    async updatePost(formData: FormData): Promise<Post> {
        const query = `
            UPDATE posts
            SET title = $1, content = $2, content_type = $3, post_key = $4, mission_post = $5
            WHERE id = $6
            RETURNING *`;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const contentType = formData.get('content_type') as string;
        const postKey = formData.get('post_key') as string;
        const missionPost = formData.get('mission_post') === 'true';
        const id = parseInt(formData.get('id') as string, 10);

        const rows = await this.client(query, [title, content, contentType, postKey, missionPost, id]);
        const row = rows[0];
        const post: Post = {
            id: row.id,
            postKey: row.post_key,
            title: row.title,
            content: row.content,
            rawText: row.raw_text,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            contentType: row.content_type,
            missionPost: row.mission_post,
        };
        return post;
    }

    async getComments(postId: string): Promise<Comment[]> {
        const query = `
            SELECT 
                comments.*,
                users.id AS user_id,
                users.first_name,
                users.last_name,
                users.username
            FROM 
                comments
            INNER JOIN 
                users
            ON 
                comments.user_id = users.id
            WHERE 
                comments.post_id = $1
            ORDER BY comments.id DESC;
        `;

        const rows = await this.client(query, [postId]);

        return rows.map((row) => ({
            id: row.id,
            postId: row.post_id,
            content: row.content,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            userData: {
                userId: row.user_id,
                firstName: row.first_name,
                lastName: row.last_name,
                username: row.username,
            },
        }));
    }

    async insertComment(postId: string, userId: string, content: string): Promise<Comment> {
        const query = `
        WITH inserted_comment AS (
            INSERT INTO comments (post_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        )
        SELECT 
            inserted_comment.*, 
            users.id AS user_id,
            users.first_name, 
            users.last_name, 
            users.username
        FROM 
            inserted_comment
        INNER JOIN 
            users
        ON 
            inserted_comment.user_id = users.id;
        `;

        const rows = await this.client(query, [postId, userId, content]);
        if (rows.length !== 1) {
            throw new Error('0 or Multiple rows returned when inserting comment');
        }
        const row = rows[0];
        return {
            id: row.id,
            postId: row.post_id,
            content: row.content,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            userData: {
                userId: row.user_id,
                firstName: row.first_name,
                lastName: row.last_name,
                username: row.username,
            },
        };
    }

    async deleteComment(commentId: string, userId: string, isAdmin: boolean) {
        let query = `DELETE FROM comments WHERE id = $1`;
        const params = [commentId];

        if (!isAdmin) {
            query += ` AND user_id = $2`;
            params.push(userId);
        }

        return await this.client(query, params);
    }

    async getUserAndRoles(email: string, getPassword?: boolean): Promise<User | undefined> {
        const query = `
            SELECT 
                u.id AS user_id,
                u.email,    
                ${getPassword ? 'u.password,' : ''}
                u.username,
                u.first_name,
                u.last_name,
                r.role_name
            FROM users u
            LEFT JOIN user_role_mappings urm ON u.id = urm.user_id
            LEFT JOIN roles r ON urm.role_id = r.id
            WHERE u.email = $1;
        `;

        const rows = await this.client(query, [email]);

        if (!rows.length) {
            return undefined;
        }

        // Extract user data from the first row
        const row = rows[0];
        return {
            id: row.user_id,
            email: row.email,
            password: row.password,
            username: row.username,
            firstName: row.first_name,
            lastName: row.last_name,
            roles: rows.map((row) => row.role_name).filter((role) => role !== null),
        };
    }

    async getUser(email: string, getPassword?: boolean): Promise<User | undefined> {
        const query = `
            SELECT 
                id
                email,    
                ${getPassword ? 'password,' : ''}
                username,
                first_name,
                last_name
            FROM users
            WHERE email = $1`;
        const rows = await this.client(query, [email]);
        if (!rows.length) {
            return undefined;
        }
        const row = rows[0];
        return {
            id: row.id,
            email: row.email,
            password: row.password,
            username: row.username,
            firstName: row.first_name,
            lastName: row.last_name,
        };
    }

    async createUser(createUserBody: {
        email: string;
        password?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<User> {
        const { email, password, username } = createUserBody;
        const existingUserQuery = `
            SELECT id, email
            FROM users
            WHERE email = $1;
        `;

        const existingUser = await this.client(existingUserQuery, [email]);

        if (existingUser.length > 0) {
            throw new Error('A user already exists with this email');
        }

        const query = `
            INSERT INTO users (email, password, username, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        // Pass the parameters in the same order as the placeholders
        const values = [email, password, username];

        // Execute the query using your database client
        const rows = await this.client(query, values);
        const row = rows[0];
        const user: User = {
            id: row.id,
            email: row.email,
            password: row.password,
            username: row.username,
            firstName: row.first_name,
            lastName: row.last_name,
        };
        return user;
    }

    async getRoles(userId: string): Promise<string[]> {
        const query = `
            SELECT roles.role_name
            FROM roles
            INNER JOIN user_role_mappings ON roles.id = user_role_mappings.role_id
            WHERE user_role_mappings.user_id = $1;
        `;

        const roles = (await this.client(query, [userId])).map((row) => row.role_name);
        return roles;
    }
}

const dbClient = new DbClient();
export default dbClient;
