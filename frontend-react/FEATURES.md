# FISE React Website Features

## Overview

Complete React website for FISE with live backend integration, interactive demos, comprehensive documentation, and real-world code examples.

## Pages

### 1. Home (`/`)

**Landing page with:**
- Hero section with gradient background
- Feature highlights (6 key features)
- How It Works section (3-step process)
- Use Cases grid (6 scenarios)
- Call-to-action section

**Technologies:**
- React Router for navigation
- Custom CSS with gradient effects
- Responsive grid layouts

### 2. Interactive Demo (`/demo`)

**Browser-based encryption demo:**
- Real-time encrypt/decrypt
- 6 preset rule configurations (defaults, simple, timestamp, etc.)
- Custom salt range controls
- Three tabs: Encrypt, Decrypt, Compare
- Code snippets showing usage
- Link to live backend demo

**Features:**
- Simulated FISE encryption (can use real library)
- Side-by-side comparison view
- Copy to clipboard functionality
- Educational info boxes

### 3. Live Backend Demo (`/demo/backend`)

**Real API integration with Fastify backend:**

#### 5 Interactive Demos:

1. **User Data** (`GET /api/user/:id`)
   - Fetch encrypted user profile
   - Shows encrypted response
   - Decrypts and displays JSON

2. **Products** (`GET /api/products`)
   - Retrieves encrypted product list
   - Demonstrates list encryption

3. **Login** (`POST /api/auth/login`)
   - Username: demo / Password: demo123
   - Returns FISE-encrypted token
   - Shows token contents after decryption

4. **Form Submit** (`POST /api/submit-form`)
   - Encrypts form data client-side
   - Sends to server encrypted
   - Receives encrypted confirmation
   - Full round-trip encryption demo

5. **Comparison** (Plaintext vs Protected)
   - Fetches both `/api/demo/plaintext` and `/api/demo/protected`
   - Shows side-by-side comparison
   - Demonstrates security value

**Features:**
- Real-time API calls
- Loading states
- Error handling
- Encrypted/decrypted data display
- JSON pretty-printing
- Shared rules configuration with backend

### 4. Documentation (`/docs`)

**Comprehensive documentation with 8 sections:**

1. **Getting Started**
   - Installation instructions
   - Quick start guide
   - Timestamp usage

2. **Core Concepts**
   - Three Security Points explained
   - Defense in Depth
   - Keyless Design philosophy

3. **API Reference**
   - encryptFise() signature
   - decryptFise() signature
   - xorCipher details
   - FiseBuilder methods
   - TypeScript types

4. **Rules Builder**
   - Fluent API documentation
   - All builder methods
   - Chaining examples

5. **Presets**
   - All 12 presets documented
   - Usage examples for each
   - When to use which preset

6. **Custom Rules**
   - How to create from scratch
   - Advanced examples
   - Testing custom rules

7. **Best Practices**
   - Security guidelines
   - Performance tips
   - Deployment advice
   - Common patterns

8. **FAQ**
   - 10 frequently asked questions
   - Troubleshooting guide
   - Security considerations

**Features:**
- Sidebar navigation (sticky)
- Code syntax highlighting
- Info boxes and concept cards
- Responsive mobile layout

### 5. Examples (`/examples`)

**6 Real-world code examples:**

1. **Backend API Protection**
   - Complete Fastify server example
   - Client-side decryption
   - 50+ lines of production code

2. **Form Data Encryption**
   - Client-side form encryption
   - Server-side decryption
   - Event handling

3. **LocalStorage Security**
   - Save/load encrypted data
   - Browser storage protection
   - Simple utility functions

4. **Session Tokens**
   - Time-based token generation
   - Token validation
   - Expiration handling
   - Login/protected routes

5. **WebSocket Messages**
   - Real-time encryption
   - Server and client code
   - Bidirectional encryption

6. **File Upload Protection**
   - Encrypt file metadata
   - Multer integration
   - Storage and retrieval

**Features:**
- Sidebar example selector
- Full code with syntax highlighting
- Copy to clipboard
- Step-by-step usage instructions
- Link to GitHub examples

## Components

### Navbar
- Responsive navigation
- Mobile hamburger menu
- Active link highlighting
- Smooth transitions
- Links to GitHub and npm

### Footer
- Three-column layout
- Resources links
- Community links
- Social media icons
- Copyright and attribution

## Technical Stack

### Frontend
- **React 18** - Latest React with hooks
- **React Router 6** - Client-side routing
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling (configured)
- **FISE** - Encryption library

### Backend (Integration)
- **Fastify** - High-performance Node.js framework
- **CORS** - Cross-origin support
- **FISE** - Server-side encryption
- **7 API endpoints** - Real-world examples

## Styling

### Custom CSS Variables
```css
--primary: #667eea
--secondary: #764ba2
--dark: #2d3748
--gray: #718096
--border: #e2e8f0
```

### Tailwind Configuration
- Custom color palette
- Extended theme
- PostCSS integration
- Autoprefixer

### Features
- Gradient backgrounds
- Smooth animations
- Hover effects
- Responsive breakpoints
- Custom scrollbar styling

## Responsive Design

### Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

### Mobile Features
- Hamburger menu
- Stacked layouts
- Touch-friendly buttons
- Readable font sizes
- Optimized spacing

## Integration Features

### Shared Configuration
Both frontend and backend use identical FISE rules:

```javascript
const rules = FiseBuilder.defaults()
  .withSaltRange(15, 50)
  .build()
```

### Timestamp Sync
Minute-level timestamps for temporal security:

```javascript
const timestamp = Math.floor(Date.now() / 60000)
```

### API Format
Consistent response structure:

```json
{ "data": "encrypted_string_here" }
```

### Error Handling
- Try-catch blocks
- User-friendly error messages
- Loading states
- Network error handling

## Development Tools

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `./start-with-backend.sh` - Full stack startup

### Documentation
- [README.md](README.md) - Quick start guide
- [INTEGRATION.md](INTEGRATION.md) - Backend integration
- [FEATURES.md](FEATURES.md) - This file

### Startup Script
Bash script that:
- Installs all dependencies
- Starts backend on port 3008
- Starts frontend on port 5173
- Handles graceful shutdown

## Security

### FISE Rules
- Shared between client/server
- Not exposed in public code
- Configurable salt ranges
- Timestamp-based security

### CORS
- Enabled for local development
- Configured for production domains
- Credentials support

### Best Practices
- HTTPS recommended for production
- Rules kept secret
- Timestamp synchronization
- Input validation

## Performance

### Optimizations
- Code splitting with Vite
- Lazy loading routes
- Minimal dependencies
- Fast build times
- Tree shaking

### Bundle Size
- React: ~40KB gzipped
- React Router: ~10KB gzipped
- FISE: ~5KB gzipped
- Total: ~55KB base + code

## Deployment

### Supported Platforms
- **Netlify** - Zero config
- **Vercel** - One command
- **GitHub Pages** - Static hosting
- **Cloudflare Pages** - Edge deployment

### Backend Hosting
- Railway
- Render
- Fly.io
- DigitalOcean App Platform
- AWS/GCP/Azure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used
- ES6+ modules
- Fetch API
- CSS Grid
- Flexbox
- Custom properties

## Future Enhancements

Potential additions:
- [ ] Real FISE encryption in browser demo (replace simulated)
- [ ] Performance benchmarks page
- [ ] Interactive rule builder
- [ ] More code examples (React, Vue, Angular)
- [ ] Video tutorials
- [ ] Playground with shareable links
- [ ] Analytics dashboard demo
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Code sandbox integration

## Credits

Built with ❤️ for the FISE community.

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Fastify
- **Encryption:** FISE library
- **Icons:** Emoji
- **Fonts:** System fonts
