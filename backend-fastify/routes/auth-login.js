import jwt from 'jsonwebtoken';
import { fiseEncrypt, fiseDecrypt } from 'fise';
import { getRulesForDemo } from '@fise-examples/shared';
import { getTimestamp, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/constants.js';

export default function registerAuthLogin(fastify) {
    // Example 6: Generate JWT Token with Two-Way Encryption (Session-Based)
    fastify.post('/api/auth/login', async (request, reply) => {
        const { data, sessionId } = request.body;

        if (!data || typeof data !== 'string') {
            return reply.code(400).send({ error: 'Encrypted credentials required' });
        }

        // Session ID is required for session-based encryption
        if (!sessionId || typeof sessionId !== 'string') {
            return reply.code(400).send({ error: 'Session ID required for session-based encryption' });
        }

        try {
            // Decrypt the incoming credentials using session-based login rules
            const decrypted = fiseDecrypt(data, getRulesForDemo('login-session'), {
                timestamp: getTimestamp(),
                metadata: { sessionId: sessionId }
            });

            const { username, password } = JSON.parse(decrypted);

            // Simulate authentication (in production, verify against database)
            if (username === 'demo' && password === 'demo123') {
                // Generate JWT token
                const jwtPayload = {
                    userId: 'user_123',
                    username: username,
                    role: 'user',
                    email: 'demo@example.com'
                };

                const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, {
                    expiresIn: JWT_EXPIRES_IN,
                    issuer: 'fise-demo-server',
                    audience: 'fise-demo-client'
                });

                // Prepare response data with JWT token
                const responseData = {
                    success: true,
                    message: 'Login successful',
                    jwt: jwtToken,
                    user: {
                        userId: jwtPayload.userId,
                        username: jwtPayload.username,
                        role: jwtPayload.role,
                        email: jwtPayload.email
                    },
                    tokenInfo: {
                        type: 'JWT',
                        expiresIn: JWT_EXPIRES_IN,
                        issuedAt: new Date().toISOString()
                    }
                };

                // Encrypt the entire response (including JWT) with session-based FISE rules
                const encryptedResponse = fiseEncrypt(
                    JSON.stringify(responseData),
                    getRulesForDemo('login-session'),
                    {
                        timestamp: getTimestamp(),
                        metadata: { sessionId: sessionId }
                    }
                );

                return { token: encryptedResponse };
            }

            return reply.code(401).send({ error: 'Invalid credentials' });
        } catch (error) {
            fastify.log.error(error, 'Failed to decrypt login credentials');
            return reply.code(400).send({ error: 'Invalid encrypted credentials' });
        }
    });
}

