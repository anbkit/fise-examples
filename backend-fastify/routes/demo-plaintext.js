export default function registerDemoPlaintext(fastify) {
    fastify.get('/api/demo/plaintext', async () => {
        const data = {
            message: 'This is unprotected data',
            apiKey: 'sk_live_abc123def456',
            internalId: 'internal_12345'
        };

        return data; // Unencrypted - easy to inspect!
    });
}
