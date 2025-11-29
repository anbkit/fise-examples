# FISE Examples & Demos

Live, working examples demonstrating FISE in real-world scenarios.

> **📦 Monorepo Structure:** This directory now uses Turborepo + npm workspaces. Install dependencies once at the root: `cd examples && npm install`

## 🏗️ Build Commands

From the `examples/` root:
```bash
npm run build                # turbo build all packages in dependency order
npm run dev -- --filter=...  # turbo dev for a specific app, e.g. backend-fastify
npm run lint                 # run lint where defined
npm run test                 # run tests where defined
```

## 🎯 Available Demos

### 1. **Backend - Fastify**
**Path:** [`/examples/backend-fastify`](./backend-fastify/)

A production-ready backend API demo using Fastify (one of the fastest Node.js frameworks).

**Features:**
- 7 real-world API endpoints
- Bidirectional encryption (request & response)
- Time-based token validation
- Rate limiting with FISE
- Full CORS support

**Quick Start:**
```bash
# 1. Install all dependencies (monorepo setup)
cd examples
npm install

# 2. Start development server
npm run dev:backend
# Or from backend-fastify directory:
cd backend-fastify && npm run dev

# 3. Build (uses local shared package via file:../shared)
npm run build:backend

# 4. Deploy to Vercel (project root = examples/backend-fastify)
vercel --prod
```

> **Note:** Please refer to the sample backend code, `shared/src/shared-rules.js` file, and demo implementations for complete examples.

**Live Test:**
```bash
# In another terminal
npm test
```

**Tech Stack:** Fastify, Node.js, FISE
**Difficulty:** Beginner
**Time:** 5 minutes to setup

[→ View Full Documentation](./backend-fastify/README.md)

---

### 2. **Frontend - React**
**Path:** [`/examples/frontend-react`](./frontend-react/)

React application demonstrating client-side FISE integration with live backend demos.

**Features:**
- Decrypt API responses
- Encrypt form submissions
- Handle authentication tokens
- Real-time data protection
- Video/binary encryption demo
- Selective encryption & lazy decryption
- Session-based encryption rules

**Quick Start:**
```bash
# From examples root (monorepo)
cd examples
npm install
npm run dev:frontend

# Or from frontend-react directory:
cd examples/frontend-react
npm run dev
```

**Tech Stack:** React, Vite, Tailwind CSS, FISE
**Status:** ✅ Available

---

### 3. **Frontend - Vue** (Coming Soon)
**Path:** `/examples/frontend-vue/`

Vue 3 application with Composition API and FISE.

**Tech Stack:** Vue 3, Vite, FISE
**Status:** 🚧 Planned

---

### 4. **Full Stack - Next.js** (Coming Soon)
**Path:** `/examples/fullstack-nextjs/`

Complete Next.js application with server-side and client-side FISE protection.

**Features:**
- API Routes with FISE
- Server-side rendering with protected data
- Client-side decryption
- Vercel deployment ready

**Tech Stack:** Next.js 14, React, FISE
**Status:** 🚧 Planned

---

### 5. **Mobile - React Native** (Coming Soon)
**Path:** `/examples/mobile-react-native/`

Cross-platform mobile app demonstrating FISE in React Native.

**Tech Stack:** React Native, Expo, FISE
**Status:** 🚧 Planned

---

## 📚 Demo Categories

### By Use Case
- **API Protection:** [Fastify Backend](./backend-fastify/)
- **Form Security:** Coming Soon
- **Token Management:** [Fastify Backend](./backend-fastify/) (Login example)
- **Rate Limiting:** [Fastify Backend](./backend-fastify/) (Limited resource example)

### By Technology
- **Node.js:** [Fastify Backend](./backend-fastify/)
- **React:** Coming Soon
- **Vue:** Coming Soon
- **TypeScript:** All examples support TypeScript

### By Complexity
- **Beginner:** [Fastify Backend](./backend-fastify/)
- **Intermediate:** Coming Soon
- **Advanced:** Coming Soon

---

## 🚀 Quick Start Any Demo

Each demo follows the same structure:

```bash
# 1. Navigate to demo
cd examples/{demo-name}

# 2. Install dependencies
npm install

# 3. Run the demo
npm run dev

# 4. Run tests (if available)
npm test
```

---

## 🎓 Learning Path

### 1. Start Here: Backend Basics
Begin with the [Fastify Backend Demo](./backend-fastify/) to understand:
- How to encrypt API responses
- How to decrypt incoming requests
- Time-based security patterns
- Production best practices

### 2. Add Frontend Integration
Once comfortable with backend, explore frontend demos to learn:
- Client-side decryption
- Secure form submission
- Token management

### 3. Full Stack Integration
Combine backend and frontend knowledge with full-stack examples:
- End-to-end data protection
- Synchronizing frontend/backend rules
- Deployment strategies

---

## 🔧 Demo Requirements

### Minimum Requirements
- Node.js 18+ (20+ recommended)
- npm 8+
- Basic JavaScript/TypeScript knowledge

### Recommended
- Understanding of REST APIs
- Familiarity with async/await
- Basic encryption concepts (helpful but not required)

---

## 📖 Documentation

Each demo includes:
- ✅ **README.md** - Full documentation
- ✅ **QUICKSTART.md** - Get running in 5 minutes
- ✅ **package.json** - Clear scripts and dependencies
- ✅ **Example code** - Well-commented, production-ready
- ✅ **Tests** - Automated test suite

---

## 🎯 Demo Features Matrix

| Feature          | Fastify | React | Vue | Next.js | React Native |
| ---------------- | ------- | ----- | --- | ------- | ------------ |
| Encrypt Response | ✅       | N/A   | 🚧   | 🚧       | 🚧            |
| Decrypt Response | ✅       | ✅     | 🚧   | 🚧       | 🚧            |
| Encrypt Request  | ✅       | ✅     | 🚧   | 🚧       | 🚧            |
| Decrypt Request  | ✅       | N/A   | 🚧   | 🚧       | 🚧            |
| Token Management | ✅       | ✅     | 🚧   | 🚧       | 🚧            |
| Rate Limiting    | ✅       | N/A   | 🚧   | 🚧       | 🚧            |
| Form Protection  | ✅       | ✅     | 🚧   | 🚧       | 🚧            |
| Binary/Video     | ✅       | ✅     | 🚧   | 🚧       | 🚧            |
| Automated Tests  | ✅       | 🚧     | 🚧   | 🚧       | 🚧            |
| TypeScript       | ✅       | ⚠️     | 🚧   | 🚧       | 🚧            |
| Production Ready | ✅       | ✅     | 🚧   | 🚧       | 🚧            |

✅ Available | 🚧 Coming Soon | ⚠️ Partial | N/A Not Applicable

---

## 💡 Contributing

Want to contribute a demo? We'd love your help!

### Demo Contribution Guidelines
1. **Choose a technology** not yet covered
2. **Follow the template** structure (see [backend-fastify](./backend-fastify/) as reference)
3. **Include tests** - All demos should have automated tests
4. **Document thoroughly** - README + QUICKSTART required
5. **Keep it simple** - Focus on clarity over features
6. **Make it production-ready** - Show best practices

**Areas we need:**
- Python backend examples (FastAPI, Flask)
- Frontend frameworks (React, Vue, Svelte, Angular)
- Mobile examples (React Native, Flutter)
- Edge computing (Cloudflare Workers, Deno Deploy)
- Desktop apps (Electron, Tauri)

[Open an issue](https://github.com/anbkit/fise/issues) to propose a demo!

---

## 🐛 Troubleshooting

### Common Issues

**Demo won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
# Change port via environment variable
PORT=3001 npm run dev
```

**Tests failing:**
```bash
# Make sure server is running first
npm run dev  # Terminal 1
npm test     # Terminal 2
```

**Module not found:**
```bash
# Make sure FISE is built
cd ../..  # Go to root
npm run build
cd examples/{demo-name}
npm install
```

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/anbkit/fise/issues)
- **Questions:** [GitHub Discussions](https://github.com/anbkit/fise/discussions)
- **Demos:** This directory contains all working examples

---

## 🎉 What's Next?

1. **Try the demos** - Start with [Fastify Backend](./backend-fastify/)
2. **Read the docs** - See [main documentation](../docs/)
3. **Build something** - Use FISE in your project
4. **Share your demo** - Contribute back to the community

Happy coding! 🚀
