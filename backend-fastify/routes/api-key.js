import { fiseEncrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp } from '../utils/constants.js';

export default function registerApiKey(fastify) {
    // Example 3: Protected API Key Generation
    fastify.post('/api/generate-key', async (request, reply) => {
        const { userId } = request.body;

        if (!userId) {
            return reply.code(400).send({ error: 'userId is required' });
        }

        // Generate API key (in production, use crypto.randomBytes)
        const apiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

        const keyData = {
            apiKey,
            userId,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            permissions: ['read', 'write']
        };

        const encrypted = fiseEncrypt(
            JSON.stringify(keyData),
            getRulesForDemo('api-key'),
            { timestamp: getTimestamp() }
        );

        return { data: encrypted };
    });
}

