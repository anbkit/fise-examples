# Deploy Frontend to Vercel

This guide shows how to deploy the FISE React frontend to Vercel using Vercel's monorepo support.

## ⚠️ Important: Vercel Monorepo Deployment

Vercel natively supports monorepos! Both frontend and backend deploy from the **same Git repository** but use **different root directories**:

- **Backend Project:** Root Directory = `examples` (for serverless API)
- **Frontend Project:** Root Directory = `examples/frontend-react` (for static site)

The key is setting the correct **Root Directory** in Vercel project settings. This tells Vercel which folder to treat as the project root, while still having access to parent directories during build.

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel CLI

```bash
# Navigate to frontend directory
cd examples/frontend-react

# Deploy to production
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** (Select your account/team)
- **Link to existing project?** No (first time) or Yes (redeploying)
- **Project name?** fise-demo-frontend (MUST be different from backend `fise-demo`)
- **In which directory is your code located?** ./ (Vercel will use `examples/frontend-react` as root)
- **Override settings?** No (uses vercel.json from this directory)

### Option 2: Deploy via Vercel Dashboard (Recommended for First Time)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (same repo as backend)
4. **IMPORTANT - Configure Root Directory:**
   - Click **"Edit"** next to Root Directory
   - Set to: `examples/frontend-react` ⚠️ **CRITICAL**
   - This tells Vercel to treat `frontend-react` as the project root

5. **Build Settings** (auto-detected from vercel.json):
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (from vercel.json)
   - **Output Directory:** `dist` (from vercel.json)
   - **Install Command:** `npm install` (from vercel.json)

6. **Environment Variables:**
   - Click **"Add"** under Environment Variables
   - Key: `VITE_API_BASE`
   - Value: `https://fise-demo.vercel.app` (your backend URL)
   - Apply to: Production, Preview, Development

7. Click **Deploy**

## 📝 Important Configuration

### Monorepo Deployment Summary

| Component | Git Repo | Root Directory | Vercel Config | Project Name |
|-----------|----------|----------------|---------------|--------------|
| Backend API | `fise` | `examples` | `examples/vercel.json` | `fise-demo` |
| Frontend | `fise` | `examples/frontend-react` | `examples/frontend-react/vercel.json` | `fise-demo-frontend` |

**How Vercel Monorepo Works:**
1. **Same Git Repository:** Both projects use the same repo
2. **Different Root Directories:** Vercel treats each root as a separate project
3. **Shared Files Access:** Frontend can import `../shared-rules.js` during build
4. **Separate Deployments:** Each has its own URL and deployment pipeline
5. **Independent Scaling:** Frontend and backend scale independently

### Backend API URL

The frontend needs to know where your backend API is deployed. Update the environment variable:

**For Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_API_BASE` with your backend URL
3. Example: `https://fise-demo.vercel.app`

**For Local Development:**
```bash
# examples/frontend-react/.env
VITE_API_BASE=http://localhost:3008
```

**For Production (in vercel.json):**
Already configured in `vercel.json` with your backend URL.

### Update Backend URL

If your backend has a custom domain, update the `VITE_API_BASE` in:
- [vercel.json](vercel.json#L14) - Line 14
- Or set it as an environment variable in Vercel Dashboard

## 🔧 Configuration Files

### vercel.json

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ],
    "env": {
        "VITE_API_BASE": "https://fise-demo.vercel.app"
    }
}
```

**What this does:**
- **buildCommand:** Builds the Vite app
- **outputDirectory:** Output folder for built files
- **rewrites:** Routes all requests to index.html (for client-side routing)
- **env:** Sets the API base URL for production

## ✅ Testing Your Deployment

After deployment:

```bash
# Get your deployment URL
vercel ls

# Test the deployment
curl https://your-frontend.vercel.app

# Open in browser
vercel open
```

Visit your deployed frontend and test:
- Home page loads
- Demo sections work
- API calls connect to your backend
- No CORS errors in browser console

## 🔄 Redeploy After Changes

### Automatic (Git Integration)
If you connected via GitHub/GitLab:
- Push changes to your repository
- Vercel auto-deploys on push

### Manual (CLI)
```bash
cd examples/frontend-react
vercel --prod
```

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify `VITE_API_BASE` points to correct backend URL
2. Check that backend has CORS enabled (should already be configured)
3. Ensure backend Deployment Protection is disabled

### Environment Variables Not Working

1. Check that `VITE_API_BASE` is set in Vercel Dashboard
2. Redeploy after adding environment variables
3. Verify the variable starts with `VITE_` (required by Vite)

### Build Failures

```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

### Routes Not Working (404 on refresh)

Verify `vercel.json` has the rewrites configuration to route all requests to `index.html`.

## 📦 Production Checklist

- [ ] Backend deployed and accessible
- [ ] `VITE_API_BASE` set to production backend URL
- [ ] CORS working between frontend and backend
- [ ] All demo features tested
- [ ] No console errors
- [ ] Backend Deployment Protection disabled (for public API)

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed
4. Update `VITE_API_BASE` if needed

## 📚 Next Steps

1. Test the full stack integration
2. Share the demo URL
3. Monitor usage in Vercel Analytics
4. Consider adding custom domain

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
