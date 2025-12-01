import { fiseEncrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';

const getTimestamp = () => Math.floor(Date.now() / 60000);

export default function registerDemoProtected(fastify) {
    fastify.get('/api/demo/protected', async () => {
        const payload = {
            message: 'This is FISE-protected data',
            apiKey: 'sk_live_abc123def456',
            internalId: 'internal_12345'
        };

        const encrypted = fiseEncrypt(
            JSON.stringify(payload),
            getRulesForDemo('comparison'),
            { timestamp: getTimestamp() }
        );

        return { data: encrypted };
    });
}
