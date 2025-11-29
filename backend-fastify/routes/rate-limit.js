import { encryptFise, decryptFise, xorCipher } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp } from '../utils/constants.js';

export default function registerRateLimit(fastify) {
    // Example 5: Rate Limiting with FISE Token
    fastify.get('/api/limited-resource', async (request, reply) => {
        const { token } = request.query;

        if (!token) {
            return reply.code(401).send({ error: 'Token required' });
        }

        try {
            // Decrypt and validate the token using auth rules
            const decrypted = decryptFise(token, xorCipher, getRulesForDemo('login'), {
                timestamp: getTimestamp()
            });

            const tokenData = JSON.parse(decrypted);

            // Validate token expiry (example: 5 minutes)
            const tokenAge = Date.now() - new Date(tokenData.createdAt).getTime();
            if (tokenAge > 5 * 60 * 1000) {
                return reply.code(401).send({ error: 'Token expired' });
            }

            // Return protected resource
            const resource = {
                message: 'This is a rate-limited resource',
                data: 'Sensitive information here',
                accessedAt: new Date().toISOString()
            };

            const encrypted = encryptFise(
                JSON.stringify(resource),
                xorCipher,
                getRulesForDemo('user-data'),
                { timestamp: getTimestamp() }
            );

            return { data: encrypted };
        } catch (error) {
            return reply.code(401).send({ error: 'Invalid token' });
        }
    });
}

