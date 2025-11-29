// JWT Secret Key (in production, use environment variable)
export const JWT_SECRET = process.env.JWT_SECRET || 'fise-demo-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour

// Helper: Get current timestamp in minutes
export function getTimestamp() {
    return Math.floor(Date.now() / 60000);
}

