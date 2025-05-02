import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import { Post, User } from './types';

const tenantId = process.env.GRAPH_TENANT_ID;
const clientId = process.env.GRAPH_CLIENT_ID;
const clientSecret = process.env.GRAPH_CLIENT_SECRET;
const notificationsEmail = process.env.NOTIFICATIONS_EMAIL;
const commentUpdateEmail = process.env.COMMENT_UPDATE_EMAIL;

if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing required environment variables for Microsoft Graph authentication');
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
});

class MicrosoftGraphClient {
    private client;

    constructor() {
        this.client = Client.initWithMiddleware({ authProvider: authProvider });
    }

    public async sendPostEmails(emails: string[], post: Post) {
        const postUrl = `https://www.brackebusch.com/${post.missionPost ? 'missions' : 'posts'}/${post.postKey}`;
        try {
            const requests = emails.map((email, index) => ({
                id: index.toString(),
                method: 'POST',
                url: `/users/${notificationsEmail}/sendMail`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    message: {
                        subject: `New ${post.missionPost ? 'Mission ' : ''}Post`,
                        body: {
                            contentType: 'HTML',
                            content: `Hey! A new ${post.missionPost ? 'mission ' : ''}post, "${post.title}" is live on brackebusch.com.<br/>
                                You can read it <a href="${postUrl}">here</a>.<br/><br/>
                                Love,<br/>Brackebusch
                            `,
                        },
                        toRecipients: [{ emailAddress: { address: email } }],
                    },
                },
            }));
            await this.client.api('/$batch').post({ requests });
        } catch (error) {
            console.error('Error sending emails:', error);
            throw error;
        }
    }

    public async sendCommentEmail(post: Post) {
        const postUrl = `https://www.brackebusch.com/${post.missionPost ? 'missions' : 'posts'}/${post.postKey}`;
        try {
            const request = {
                message: {
                    subject: 'New Comment',
                    body: {
                        contentType: 'HTML',
                        content: `Someone commented on "${post.title}"!<br/>
                            Check it out <a href="${postUrl}">here</a>.`,
                    },
                    toRecipients: [{ emailAddress: { address: commentUpdateEmail } }],
                },
            };
            await this.client.api(`/users/${notificationsEmail}/sendMail`).post(request);
        } catch (error) {
            console.error('Error sending emails:', error);
            throw error;
        }
    }
}

const microsoftGraphClient = new MicrosoftGraphClient();
export default microsoftGraphClient;
