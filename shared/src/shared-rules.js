/**
 * Shared FISE Rules Configuration
 *
 * This file defines the rules used by both frontend and backend for each demo.
 * IMPORTANT: Keep this file synchronized between client and server!
 */

import { FiseBuilder } from 'fise'

/**
 * Default rules for general API endpoints
 * Used by: user data, products, analytics
 */
export const defaultRules = FiseBuilder.defaults()
    .withSaltRange(15, 50)
    .build()

/**
 * Login/Authentication rules with timestamp-based security
 * Used by: login, session tokens
 * Changes every minute for temporal security
 */
export const authRules = FiseBuilder.timestamp()
    .withSaltRange(20, 40)
    .build()

/**
 * Session-based login rules with per-session encryption diversity
 * Used by: login demo with session isolation
 * Combines timestamp and session ID for unique encryption per session
 * 
 * Usage: Pass sessionId in metadata when encrypting/decrypting
 * @example
 * encryptFise(data, cipher, sessionLoginRules, { 
 *   timestamp: getTimestamp(),
 *   metadata: { sessionId: 'abc123' } 
 * })
 */
export const sessionLoginRules = FiseBuilder.timestamp(13, 17)
    .withSaltRange(20, 40)
    .withOffset((cipherText, ctx) => {
        const len = cipherText.length || 1
        const t = ctx.timestamp ?? 0
        // Use session ID from metadata for session-specific offset
        const sessionId = ctx.metadata?.sessionId ?? ''
        // Hash session ID to a number for offset calculation
        const sessionHash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // Combine timestamp and session hash for unique per-session encryption
        return (len * 13 + (t % 17) + (sessionHash % 23)) % len
    })
    .build()

/**
 * Form submission rules with multi-factor security
 * Used by: form submissions, user input
 * Combines length, timestamp, and prime calculations
 */
export const formRules = FiseBuilder.multiFactor()
    .withSaltRange(25, 60)
    .build()

/**
 * High-security rules for sensitive data
 * Used by: API keys, tokens, credentials
 * Maximum salt range and complex offset calculation
 */
export const sensitiveRules = FiseBuilder.multiFactor()
    .withSaltRange(40, 100)
    .withOffset((cipherText, ctx) => {
        const len = cipherText.length || 1
        const t = ctx.timestamp ?? 0
        const charCode = cipherText.charCodeAt(0) || 0
        // Complex calculation combining multiple factors
        return (len * 7 + t * 13 + charCode * 3) % len
    })
    .build()

/**
 * Simple rules for demo/testing
 * Used by: comparison demo, testing
 * Minimal security for demonstration purposes
 */
export const demoRules = FiseBuilder.simple()
    .withSaltRange(10, 20)
    .build()

/**
 * Length-based rules (no timestamp dependency)
 * Used by: localStorage, static content
 * Works without time synchronization
 */
export const storageRules = FiseBuilder.lengthBased()
    .withSaltRange(15, 35)
    .build()

/**
 * Video encryption rules optimized for streaming and parallel processing
 * Used by: video chunks, media streaming
 * Designed for fast encryption/decryption of large binary data
 * 
 * Performance optimizations:
 * - Fixed salt length (20 bytes) eliminates salt range search loop
 * - Offset bounded to 2MB provides good security while maintaining fast decryption
 * 
 * Security features:
 * - Custom encodeLength/decodeLength: Uses 100 bytes with obfuscation instead of standard 2-byte encoding
 *   This is a CRITICAL security point - even if attacker knows salt length (20) and offset position,
 *   they cannot decrypt without knowing the decodeLength function. The 100-byte format makes brute force
 *   much more expensive. The rules themselves are the security.
 * 
 * The Power of FISE Rules:
 * - Attacker may know: salt length, offset position, cipher type
 * - But without decodeLength: they cannot extract salt length from envelope → cannot extract salt → cannot decrypt
 * - This makes decodeLength one of the most important security points in FISE
 * 
 * Additional security customization options (users can increase security by):
 * 1. More complex offset() formula (e.g., add timestamp, metadata, multiple factors)
 * 2. Variable saltRange (e.g., 15-50 instead of fixed 20)
 * 3. Custom extractSalt()/stripSalt() (e.g., split salt, head-based extraction)
 * 4. Custom cipher implementation (e.g., AES instead of XOR)
 */
// Custom binary encodeLength/decodeLength for video encryption
// Uses 100 bytes with obfuscation instead of standard 2-byte big-endian
// This significantly increases security by making the encoding format unique and harder to brute force
function encodeVideoLength(len, _ctx) {
    // Encode as 100 bytes: [len_high, len_low, obfuscated_data..., checksum]
    // The length is stored in first 2 bytes, followed by 97 bytes of obfuscated data, then checksum
    const lenHigh = (len >> 8) & 0xFF;
    const lenLow = len & 0xFF;
    const result = new Uint8Array(100);

    // Store length in first 2 bytes
    result[0] = lenHigh;
    result[1] = lenLow;

    // Fill middle 97 bytes with obfuscated data based on length
    // This makes the encoding format unique and harder to reverse engineer
    for (let i = 2; i < 99; i++) {
        result[i] = (lenHigh * (i + 1) + lenLow * (i + 2) + 0x42 + i) % 256;
    }

    // Calculate checksum: sum of all bytes mod 256
    let sum = 0;
    for (let i = 0; i < 99; i++) {
        sum = (sum + result[i]) % 256;
    }
    result[99] = sum; // Checksum in last byte

    return result;
}

function decodeVideoLength(encoded, _ctx) {
    // Decode from 100 bytes: [len_high, len_low, obfuscated_data..., checksum]
    if (encoded.length < 100) return NaN;

    const lenHigh = encoded[0];
    const lenLow = encoded[1];
    const checksum = encoded[99];

    // Validate checksum: sum of first 99 bytes should equal checksum
    let sum = 0;
    for (let i = 0; i < 99; i++) {
        sum = (sum + encoded[i]) % 256;
    }
    if (sum !== checksum) return NaN;

    // Validate obfuscated data matches expected pattern
    for (let i = 2; i < 99; i++) {
        const expected = (lenHigh * (i + 1) + lenLow * (i + 2) + 0x42 + i) % 256;
        if (encoded[i] !== expected) return NaN;
    }

    return (lenHigh << 8) | lenLow;
}

export const videoRules = {
    offset(cipherText, ctx) {
        // Fast offset calculation optimized for large chunks
        // For large data: bound to 10MB for security while maintaining performance
        const MAX_OFFSET = 2 * 1024 * 1024; // 2MB maximum - good security for large data
        const len = cipherText.length || 1
        const chunkIndex = ctx.chunkIndex ?? 0
        const calculatedOffset = (chunkIndex * 7 + len * 3) % len
        // Cap at 10MB for large data, but for small data offset is naturally bounded by len
        return Math.min(calculatedOffset, Math.min(MAX_OFFSET - 1, len - 1))
    },
    encodeLength: encodeVideoLength,
    decodeLength: decodeVideoLength,
    saltRange: { min: 20, max: 20 } // Fixed salt length - eliminates salt range search loop
}

/**
 * Product-specific rules with offset based on product_id from metadata
 * Used by: product listings where each item's name/price is encrypted separately
 * Offset calculation uses product_id from metadata for per-item diversity
 * 
 * Usage: Pass productId in metadata when encrypting/decrypting
 * @example
 * encryptFise(data, cipher, productRules, { metadata: { productId: 123 } })
 */
export const productRules = FiseBuilder.lengthBased()
    .withSaltRange(15, 50)
    .withOffset((cipherText, ctx) => {
        const len = cipherText.length || 1
        const productId = ctx.metadata?.productId ?? 0
        // Offset based on product_id for per-item diversity
        return (productId * 7 + len * 3) % len
    })
    .build()
/**
 * Rules mapping for each demo scenario
 */
export const DEMO_RULES = {
    'user-data': defaultRules,
    'products': productRules,
    'login': authRules,
    'login-session': sessionLoginRules, // Session-based login rules
    'form': formRules,
    'api-key': sensitiveRules,
    'analytics': defaultRules,
    'comparison': demoRules,
    'storage': storageRules,
    'video': videoRules
}

/**
 * Get rules for a specific demo
 * @param {string} demoName - Name of the demo
 * @returns {FiseRules} The rules for that demo
 */
export function getRulesForDemo(demoName) {
    return DEMO_RULES[demoName] || defaultRules
}

/**
 * Export individual rules for direct use
 */
export {
    defaultRules as default
}

/**
 * Metadata about each rule configuration
 */
export const RULES_METADATA = {
    'user-data': {
        name: 'Default Rules',
        description: 'Standard protection for user data endpoints',
        security: 'medium',
        timestampRequired: true
    },
    'products': {
        name: 'Product Rules',
        description: 'Per-item encryption with product_id-based offset',
        security: 'medium',
        timestampRequired: false
    },
    'login': {
        name: 'Authentication Rules',
        description: 'Timestamp-heavy for session tokens',
        security: 'high',
        timestampRequired: true
    },
    'login-session': {
        name: 'Session-Based Login Rules',
        description: 'Per-session encryption with session ID isolation',
        security: 'very-high',
        timestampRequired: true
    },
    'form': {
        name: 'Multi-Factor Rules',
        description: 'Complex offset for form submissions',
        security: 'high',
        timestampRequired: true
    },
    'api-key': {
        name: 'Sensitive Data Rules',
        description: 'Maximum security for API keys',
        security: 'very-high',
        timestampRequired: true
    },
    'analytics': {
        name: 'Default Rules',
        description: 'Standard protection for analytics data',
        security: 'medium',
        timestampRequired: true
    },
    'comparison': {
        name: 'Demo Rules',
        description: 'Simple rules for demonstration',
        security: 'low',
        timestampRequired: false
    },
    'storage': {
        name: 'Storage Rules',
        description: 'Length-based without timestamp',
        security: 'medium',
        timestampRequired: false
    },
    'video': {
        name: 'Video/Binary Encryption Rules',
        description: 'Optimized for parallel chunk encryption',
        security: 'medium',
        timestampRequired: false
    }
}
