import { fiseEncrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';

export default function registerProducts(fastify) {
    // Example 2: Protected Product List
    fastify.get('/api/products', async (request, reply) => {
        const products = [
            { id: 1, name: 'Premium Plan', price: 29.99, features: ['Feature A', 'Feature B'] },
            { id: 2, name: 'Pro Plan', price: 49.99, features: ['Feature A', 'Feature B', 'Feature C'] },
            { id: 3, name: 'Enterprise Plan', price: 99.99, features: ['All Features', 'Priority Support'] }
        ];

        // Encrypt name and price for each product individually using product_id in metadata
        const encryptedProducts = products.map(product => {
            const encryptedName = fiseEncrypt(
                product.name,
                getRulesForDemo('products'),
                { metadata: { productId: product.id } }
            );

            const encryptedPrice = fiseEncrypt(
                product.price.toString(),
                getRulesForDemo('products'),
                { metadata: { productId: product.id } }
            );

            return {
                id: product.id,
                name: encryptedName,
                price: encryptedPrice,
                features: product.features // Keep features unencrypted for demo
            };
        });

        return { data: encryptedProducts };
    });
}

