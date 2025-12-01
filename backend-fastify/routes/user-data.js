import { fiseEncrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp } from '../utils/constants.js';

export default function registerUserData(fastify) {
    // Example 1: Protected User Data
    fastify.get('/api/user/:id', async (request, reply) => {
        const { id } = request.params;

        // Simulate database fetch
        const userData = {
            id,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            credits: 1250,
            lastLogin: '2025-11-27T10:30:00Z'
        };

        // Encrypt the response with FISE using user-data rules
        const plaintext = JSON.stringify(userData);
        const encrypted = fiseEncrypt(plaintext, getRulesForDemo('user-data'), {
            timestamp: getTimestamp()
        });

        return { data: encrypted };
    });
}

