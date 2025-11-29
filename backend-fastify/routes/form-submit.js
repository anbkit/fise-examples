import { encryptFise, decryptFise, xorCipher } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp } from '../utils/constants.js';

export default function registerFormSubmit(fastify) {
    // Example 4: Accepting Encrypted Data from Client
    fastify.post('/api/submit-form', async (request, reply) => {
        const { data } = request.body;

        if (!data || typeof data !== 'string') {
            return reply.code(400).send({ error: 'Encrypted data required' });
        }

        try {
            // Decrypt the incoming data (client uses form rules)
            const decrypted = decryptFise(data, xorCipher, getRulesForDemo('form'), {
                timestamp: getTimestamp()
            });

            const formData = JSON.parse(decrypted);

            fastify.log.info({ formData }, 'Received form data');

            // Process the form (validation, database save, etc.)
            // ... your business logic here ...

            // Return encrypted confirmation
            const confirmation = {
                success: true,
                message: 'Form submitted successfully',
                submittedAt: new Date().toISOString(),
                formId: Math.random().toString(36).substring(2, 11)
            };

            const encrypted = encryptFise(
                JSON.stringify(confirmation),
                xorCipher,
                getRulesForDemo('form'),
                { timestamp: getTimestamp() }
            );

            return { data: encrypted };
        } catch (error) {
            fastify.log.error(error, 'Failed to decrypt form data');
            return reply.code(400).send({ error: 'Invalid encrypted data' });
        }
    });
}

