/**
 * Test client for FISE Fastify backend
 * Run this after starting the server to see FISE in action
 */

import { decryptFise, encryptFise, xorCipher, FiseBuilder } from 'fise';

// Must match backend rules!
const clientRules = FiseBuilder.defaults()
    .withSaltRange(15, 50)
    .build();

const BASE_URL = 'http://localhost:3008';

// Helper to get current timestamp
function getTimestamp() {
    return Math.floor(Date.now() / 60000);
}

// ============================================================================
// Test Functions
// ============================================================================

async function testHealthCheck() {
    console.log('\n📡 Testing Health Check...');
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health:', data);
}

async function testProtectedUserData() {
    console.log('\n👤 Testing Protected User Data...');
    const response = await fetch(`${BASE_URL}/api/user/123`);
    const { data } = await response.json();

    console.log('🔒 Encrypted response:', data);

    // Decrypt the response (using current timestamp)
    const plaintext = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const userData = JSON.parse(plaintext);
    console.log('🔓 Decrypted user data:', userData);
}

async function testProductList() {
    console.log('\n🛍️  Testing Protected Product List...');
    const response = await fetch(`${BASE_URL}/api/products`);
    const { data } = await response.json();

    console.log('🔒 Encrypted response length:', data.length, 'chars');

    const plaintext = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const products = JSON.parse(plaintext);
    console.log('🔓 Decrypted products:', products);
}

async function testGenerateKey() {
    console.log('\n🔑 Testing API Key Generation...');
    const response = await fetch(`${BASE_URL}/api/generate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_456' })
    });

    const { data } = await response.json();
    console.log('🔒 Encrypted key data:', data.substring(0, 50) + '...');

    const plaintext = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const keyData = JSON.parse(plaintext);
    console.log('🔓 Decrypted API key:', keyData);
}

async function testSubmitForm() {
    console.log('\n📝 Testing Encrypted Form Submission...');

    const formData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'This form data is encrypted before sending!'
    };

    // Encrypt the form data before sending
    const encrypted = encryptFise(
        JSON.stringify(formData),
        xorCipher,
        clientRules,
        { timestamp: getTimestamp() }
    );

    console.log('🔒 Sending encrypted form:', encrypted.substring(0, 50) + '...');

    const response = await fetch(`${BASE_URL}/api/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: encrypted })
    });

    const { data: encryptedResult } = await response.json();

    // Decrypt the confirmation
    const confirmationText = decryptFise(encryptedResult, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const confirmation = JSON.parse(confirmationText);
    console.log('🔓 Server confirmation:', confirmation);
}

async function testLogin() {
    console.log('\n🔐 Testing Login...');

    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'demo',
            password: 'demo123'
        })
    });

    const { token } = await response.json();

    if (token) {
        console.log('✅ Login successful!');
        console.log('🔒 Encrypted token:', token.substring(0, 50) + '...');

        // Decrypt the token to see what's inside
        const tokenText = decryptFise(token, xorCipher, clientRules, {
            timestamp: getTimestamp()
        });

        const tokenData = JSON.parse(tokenText);
        console.log('🔓 Token contents:', tokenData);

        // Use the token to access protected resource
        await testProtectedResource(token);
    }
}

async function testProtectedResource(token) {
    console.log('\n🛡️  Testing Protected Resource with Token...');

    const response = await fetch(`${BASE_URL}/api/limited-resource?token=${encodeURIComponent(token)}`);
    const { data } = await response.json();

    const plaintext = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const resource = JSON.parse(plaintext);
    console.log('🔓 Protected resource:', resource);
}

async function testAnalytics() {
    console.log('\n📊 Testing Analytics Data...');

    const response = await fetch(`${BASE_URL}/api/analytics?page=1&limit=5`);
    const { data } = await response.json();

    console.log('🔒 Encrypted analytics length:', data.length, 'chars');

    const plaintext = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });

    const analytics = JSON.parse(plaintext);
    console.log('🔓 Analytics:', {
        page: analytics.page,
        total: analytics.total,
        dataPoints: analytics.data.length,
        firstEntry: analytics.data[0]
    });
}

async function compareProtection() {
    console.log('\n🔍 Comparing Protected vs Unprotected...');

    // Unprotected
    const plainResponse = await fetch(`${BASE_URL}/api/demo/plaintext`);
    const plainData = await plainResponse.json();

    console.log('\n❌ Unprotected endpoint:');
    console.log('   Response:', JSON.stringify(plainData, null, 2));
    console.log('   ⚠️  Easily readable! API keys and internal IDs are visible!');

    // Protected
    const protectedResponse = await fetch(`${BASE_URL}/api/demo/protected`);
    const { data } = await protectedResponse.json();

    console.log('\n✅ FISE-protected endpoint:');
    console.log('   Encrypted:', data.substring(0, 60) + '...');
    console.log('   ✓ Obscured! Harder to reverse engineer!');

    // Decrypt to show it's the same data
    const decrypted = decryptFise(data, xorCipher, clientRules, {
        timestamp: getTimestamp()
    });
    console.log('   Decrypted:', JSON.parse(decrypted));
}

// ============================================================================
// Run All Tests
// ============================================================================

async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 FISE Fastify Backend Test Client');
    console.log('═══════════════════════════════════════════════════════════');

    try {
        await testHealthCheck();
        await testProtectedUserData();
        await testProductList();
        await testGenerateKey();
        await testSubmitForm();
        await testLogin();
        await testAnalytics();
        await compareProtection();

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('✅ All tests completed successfully!');
        console.log('═══════════════════════════════════════════════════════════\n');
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/health`, { timeout: 2000 });
        if (response.ok) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}

// Main execution
const serverRunning = await checkServer();
if (!serverRunning) {
    console.error('\n❌ Server is not running!');
    console.error('Please start the server first:');
    console.error('  npm run dev\n');
    process.exit(1);
}

await runAllTests();
