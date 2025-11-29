# Backend Integration Guide

This guide shows how to run the React website with the Fastify backend for a complete live demo.

## Architecture

```
┌─────────────────┐          ┌──────────────────┐
│  React Website  │  HTTP    │ Fastify Backend  │
│  localhost:5173 │ ────────>│ localhost:3008   │
│                 │          │                  │
│  - Encrypts     │          │  - Encrypts      │
│  - Decrypts     │          │  - Decrypts      │
│  - FISE Client  │          │  - FISE Server   │
└─────────────────┘          └──────────────────┘
```

## Quick Start

### 1. Terminal 1 - Start Backend

```bash
cd examples/backend-fastify
npm install
npm run dev
```

Backend will be available at `http://localhost:3008`

### 2. Terminal 2 - Start Frontend

```bash
cd examples/frontend-react
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 3. Access the Demo

Open your browser to:
- http://localhost:5173 - Main website
- http://localhost:5173/demo - Live backend integration demo

## Features

The integrated demo demonstrates:

### 1. **Fetch User Data** (`GET /api/user/:id`)
- Frontend sends user ID
- Backend encrypts user data with FISE
- Frontend receives encrypted response
- Frontend decrypts and displays data

### 2. **Fetch Products** (`GET /api/products`)
- Backend returns encrypted product list
- Frontend decrypts and displays products

### 3. **Login** (`POST /api/auth/login`)
- Frontend sends credentials (demo/demo123)
- Backend validates and returns encrypted token
- Frontend decrypts token to show contents

### 4. **Form Submit** (`POST /api/submit-form`)
- Frontend encrypts form data before sending
- Backend decrypts, processes, and responds with encrypted confirmation
- Frontend decrypts confirmation

### 5. **Comparison** (`GET /api/demo/plaintext` vs `/api/demo/protected`)
- Shows side-by-side comparison of protected vs unprotected endpoints
- Demonstrates why FISE protection is valuable

## How It Works

### Shared Configuration

Both client and server use **identical rules**:

**Backend** (`examples/backend-fastify/server.js`):
```javascript
const backendRules = FiseBuilder.defaults()
  .withSaltRange(15, 50)
  .build()
```

**Frontend** (`examples/frontend-react/src/pages/DemoBackend.jsx`):
```javascript
const clientRules = FiseBuilder.defaults()
  .withSaltRange(15, 50)
  .build()
```

### Encryption Flow

1. **Backend encrypts response:**
   ```javascript
   const encrypted = encryptFise(
     JSON.stringify(data),
     xorCipher,
     backendRules,
     { timestamp: Math.floor(Date.now() / 60000) }
   )
   return { data: encrypted }
   ```

2. **Frontend decrypts response:**
   ```javascript
   const { data } = await response.json()
   const plaintext = decryptFise(
     data,
     xorCipher,
     clientRules,
     { timestamp: Math.floor(Date.now() / 60000) }
   )
   const result = JSON.parse(plaintext)
   ```

### Timestamp Synchronization

FISE uses minute-level timestamps for temporal security:

```javascript
const getTimestamp = () => Math.floor(Date.now() / 60000)
```

Both client and server must use the **same timestamp** (within the same minute) for successful encryption/decryption.

## API Endpoints

The backend provides these encrypted endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/:id` | GET | Fetch user data |
| `/api/products` | GET | Fetch product list |
| `/api/generate-key` | POST | Generate API key |
| `/api/submit-form` | POST | Accept encrypted form data |
| `/api/limited-resource` | GET | Rate-limited resource |
| `/api/auth/login` | POST | Login and get token |
| `/api/analytics` | GET | Paginated analytics data |
| `/api/demo/plaintext` | GET | Unprotected endpoint (comparison) |
| `/api/demo/protected` | GET | FISE-protected endpoint |

## CORS Configuration

The backend has CORS enabled for local development:

```javascript
await fastify.register(cors, {
  origin: true, // Allows all origins in dev
  credentials: true
})
```

**For production**, change to:

```javascript
await fastify.register(cors, {
  origin: 'https://fise.dev', // Your production domain
  credentials: true
})
```

## Troubleshooting

### Backend Not Running

Error: `Failed to fetch` or `Network error`

**Solution:** Make sure the backend is running on port 3008:
```bash
cd examples/backend-fastify
npm run dev
```

### Port Already in Use

Error: `address already in use :::3008`

**Solution:** Kill the process using port 3008:
```bash
# macOS/Linux
lsof -ti:3008 | xargs kill -9

# Windows
netstat -ano | findstr :3008
taskkill /PID <PID> /F
```

### Timestamp Mismatch

Error: `Failed to decrypt` or `Invalid encrypted data`

**Solution:** This usually happens if:
- System clocks are out of sync (unlikely in local dev)
- Rules configuration differs between client and server
- Check that both use identical `FiseBuilder` configuration

### CORS Errors

Error: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:** Ensure CORS is registered in backend:
```javascript
await fastify.register(cors, { origin: true })
```

## Production Deployment

### Backend

1. Set environment variables:
   ```bash
   export PORT=3008
   export HOST=0.0.0.0
   export NODE_ENV=production
   ```

2. Update CORS to specific domain:
   ```javascript
   origin: 'https://fise.dev'
   ```

3. Keep rules configuration secret (use environment variables)

4. Deploy to your hosting service (Railway, Render, Fly.io, etc.)

### Frontend

1. Configure API base URL via environment variable:
   ```bash
   # Create .env file
   VITE_API_BASE=https://api.fise.dev
   ```
   
   Or set it during build:
   ```bash
   VITE_API_BASE=https://api.fise.dev npm run build
   ```
   
   The configuration is in `src/config.ts`:
   ```typescript
   export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3008";
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Deploy `dist/` folder to:
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages

## Security Considerations

1. **Rules are not keys** - FISE provides obfuscation, not cryptographic security
2. **Always use HTTPS** in production
3. **Keep rules configuration** consistent between client and server
4. **Don't expose rules** in public repositories (use environment variables)
5. **Use FISE as an additional layer** on top of TLS/HTTPS, not as replacement

## Next Steps

- Customize the rules configuration for your use case
- Add authentication middleware
- Implement rate limiting
- Add request validation
- Create custom error handling
- Add logging and monitoring

## Support

- Documentation: http://localhost:5173/docs
- Examples: http://localhost:5173/examples
- GitHub: https://github.com/anbkit/fise
- Issues: https://github.com/anbkit/fise/issues
