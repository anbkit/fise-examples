# FISE Demo Website

Modern React website for FISE - Fast Internet Secure Extensible encryption library.

## Features

- **Interactive Demo** - Try FISE encryption in your browser
- **Complete Documentation** - API reference, tutorials, and guides
- **Code Examples** - Real-world usage patterns
- **Responsive Design** - Works on all devices
- **Tailwind CSS** - Modern utility-first styling

## Quick Start

### Installation

```bash
npm install
```

### Development (Frontend Only)

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Configuration

The API base URL can be configured via environment variable:

```bash
# Create .env file (optional, defaults to http://localhost:3008)
VITE_API_BASE=http://localhost:3008
```

Or set it when running:
```bash
VITE_API_BASE=http://localhost:3008 npm run dev
```

The configuration is in `src/config.ts` and defaults to `http://localhost:3008` if not set.

### Full Stack Demo (Frontend + Backend)

Run both the React website and Fastify backend together:

```bash
./start-with-backend.sh
```

This will start:
- Backend API at `http://localhost:3008`
- Frontend website at `http://localhost:5173`

Then visit `http://localhost:5173/demo` for the live integration demo.

See [INTEGRATION.md](INTEGRATION.md) for detailed setup instructions.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend-react/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx     # Navigation bar
│   │   └── Footer.jsx     # Footer with links
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Landing page
│   │   ├── DemoBackend.jsx    # Live backend demo
│   │   ├── Documentation.jsx  # Docs viewer
│   │   └── Examples.jsx   # Code examples
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies
```

## Pages

### Home (`/`)
Landing page with:
- Hero section
- Feature highlights
- How it works
- Use cases
- Call-to-action

### Demo (`/demo`)
Live backend integration demo:
- Fetch encrypted user data
- Retrieve encrypted products
- Login with encrypted tokens
- Submit encrypted forms
- Compare plaintext vs protected endpoints
- Real API calls with Fastify backend

### Documentation (`/docs`)
Complete documentation:
- Getting started guide
- Core concepts
- API reference
- Rules builder
- Presets
- Custom rules
- Best practices
- FAQ

### Examples (`/examples`)
Code examples for:
- Backend API protection
- Form data encryption
- LocalStorage security
- Session tokens
- WebSocket messages
- File upload protection

## Technology Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **React Router 6** - Routing
- **Tailwind CSS 3** - Styling
- **FISE** - Encryption library

## Customization

### API Configuration

The API base URL is configured in `src/config.ts` and can be set via environment variable:

```bash
# Create .env file
VITE_API_BASE=http://localhost:3008
```

Default: `http://localhost:3008` (if not set)

### Colors

Edit `tailwind.config.js` to change the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      // ... more colors
    }
  }
}
```

### Content

All page content is in the `src/pages/` directory. Edit the JSX files to update content.

## Deployment

### Cloudflare Pages

**Recommended for FISE demos** - Fast, free, and easy to deploy.

#### Option 1: Deploy via Cloudflare Dashboard

1. **Connect your repository:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository

2. **Configure build settings:**
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `examples/frontend-react` (if deploying from monorepo)

3. **Set environment variables:**
   - Go to Settings → Environment variables
   - Add `VITE_API_BASE` with your backend API URL
   - Example: `VITE_API_BASE=https://your-backend-api.com`

4. **Deploy:**
   - Cloudflare will automatically deploy on every push to your branch
   - Your site will be available at `https://your-project.pages.dev`

#### Option 2: Deploy via Wrangler CLI

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=fise-demo
```

#### Important Notes for Cloudflare Pages

- **SPA Routing:** The `public/_redirects` file ensures React Router works correctly
- **Environment Variables:** Set `VITE_API_BASE` in Cloudflare Pages dashboard
- **CORS:** Make sure your backend API allows requests from your Cloudflare Pages domain

### Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel

**Excellent for React + Vite** - Auto-detects Vite, zero configuration needed.

#### Option 1: Deploy via Vercel Dashboard

1. **Connect your repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your Git repository

2. **Configure project settings:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `examples/frontend-react` (if deploying from monorepo)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

3. **Set environment variables:**
   - Go to Settings → Environment Variables
   - Add `VITE_API_BASE` with your backend API URL
   - Example: `VITE_API_BASE=https://your-backend-api.com`
   - Apply to: Production, Preview, Development

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy on every push
   - Your site will be available at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Deploy to production
vercel --prod
```

#### Important Notes for Vercel

- **SPA Routing:** The `vercel.json` file includes rewrites for React Router
- **Auto-detection:** Vercel automatically detects Vite and configures build settings
- **Environment Variables:** Set `VITE_API_BASE` in Vercel dashboard or via CLI
- **Preview Deployments:** Every PR gets a preview URL automatically
- **CORS:** Make sure your backend API allows requests from your Vercel domain

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
