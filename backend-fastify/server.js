import Fastify from 'fastify';
import cors from '@fastify/cors';
import registerDemoPlaintext from './routes/demo-plaintext.js';
import registerDemoProtected from './routes/demo-protected.js';
import registerUserData from './routes/user-data.js';
import registerProducts from './routes/products.js';
import registerApiKey from './routes/api-key.js';
import registerFormSubmit from './routes/form-submit.js';
import registerRateLimit from './routes/rate-limit.js';
import registerAuthLogin from './routes/auth-login.js';
import registerAnalytics from './routes/analytics.js';

// ============================================================================
// FISE Configuration
// ============================================================================

// Rules are now imported from shared-rules.js
// Each demo uses specific rules as defined in the shared configuration

// ============================================================================
// Fastify Server Setup
// ============================================================================

const fastify = Fastify({
    logger: true  // Simple logging without pino-pretty
});

// Enable CORS for frontend access
// Allow all origins for demo purposes
await fastify.register(cors, {
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflight: true, // Explicitly enable preflight handling
    strictPreflight: false // Allow preflight even if not configured
});

// ============================================================================
// API Routes
// ============================================================================

// Health check
fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register all demo routes
registerUserData(fastify);
registerProducts(fastify);
registerApiKey(fastify);
registerFormSubmit(fastify);
registerRateLimit(fastify);
registerAuthLogin(fastify);
registerAnalytics(fastify);

// Demo routes registered via modules
registerDemoPlaintext(fastify);
registerDemoProtected(fastify);
// ============================================================================
// Error Handling
// ============================================================================

fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    reply.code(error.statusCode || 500).send({
        error: error.message || 'Internal Server Error',
        statusCode: error.statusCode || 500
    });
});

// ============================================================================
// Export for Vercel Serverless
// ============================================================================

// Singleton pattern to avoid re-initializing Fastify on every request
let isReady = false;

// Export the Fastify instance for Vercel serverless functions
export default async (req, res) => {
    try {
        // Initialize Fastify only once (singleton pattern for serverless)
        if (!isReady) {
            await fastify.ready();
            isReady = true;
        }

        // Get origin from request headers
        const origin = req.headers.origin || '*';

        // Handle CORS preflight explicitly for Vercel
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.statusCode = 200;
            return res.end();
        }

        // Intercept res.writeHead to inject CORS headers
        const originalWriteHead = res.writeHead;
        res.writeHead = function(statusCode, statusMessage, headers) {
            // Handle both writeHead(status, headers) and writeHead(status, message, headers)
            let finalHeaders = headers;
            if (typeof statusMessage === 'object') {
                finalHeaders = statusMessage;
            }

            finalHeaders = finalHeaders || {};
            finalHeaders['Access-Control-Allow-Origin'] = origin;
            finalHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            finalHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            finalHeaders['Access-Control-Allow-Credentials'] = 'true';

            if (typeof statusMessage === 'object') {
                return originalWriteHead.call(this, statusCode, finalHeaders);
            } else {
                return originalWriteHead.call(this, statusCode, statusMessage, finalHeaders);
            }
        };

        // Ensure request has required properties
        if (!req.url) {
            req.url = req.path || '/';
        }
        if (!req.method) {
            req.method = 'GET';
        }

        // Use Fastify's server to handle the request
        // Vercel's req/res are Node.js IncomingMessage/ServerResponse, which Fastify can handle
        fastify.server.emit('request', req, res);
    } catch (error) {
        fastify.log.error(error);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
};

// ============================================================================
// Start Server (for local development)
// ============================================================================

// Only start the server if not running on Vercel
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3008;
    const HOST = process.env.HOST || '0.0.0.0';

    try {
        await fastify.listen({ port: PORT, host: HOST });

        console.log('\n🚀 FISE Fastify Demo Server Started!');
        console.log(`📡 Server running at: http://localhost:${PORT}`);
        console.log('\n📋 Available endpoints:');
        console.log('  GET  /health');
        console.log('  GET  /user/:id');
        console.log('  GET  /products');
        console.log('  POST /generate-key');
        console.log('  POST /submit-form');
        console.log('  GET  /limited-resource?token=...');
        console.log('  POST /auth/login');
        console.log('  GET  /analytics?page=1&limit=10');
        console.log('\n🧪 Demo endpoints:');
        console.log('  GET  /demo/plaintext  (unprotected)');
        console.log('  GET  /demo/protected  (FISE-protected)');
        console.log(`\n💡 Try: curl http://localhost:${PORT}/demo/protected\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
