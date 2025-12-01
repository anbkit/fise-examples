import { fiseEncrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp } from '../utils/constants.js';

export default function registerAnalytics(fastify) {
    // Example 7: Bulk Data with Pagination
    fastify.get('/api/analytics', async (request, reply) => {
        const { page = 1, limit = 10 } = request.query;

        // Simulate analytics data
        const analytics = {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 100,
            data: Array.from({ length: parseInt(limit) }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                views: Math.floor(Math.random() * 1000) + 100,
                clicks: Math.floor(Math.random() * 100) + 10,
                conversions: Math.floor(Math.random() * 10) + 1
            }))
        };

        const encrypted = fiseEncrypt(
            JSON.stringify(analytics),
            getRulesForDemo('analytics'),
            { timestamp: getTimestamp() }
        );

        return { data: encrypted };
    });
}

