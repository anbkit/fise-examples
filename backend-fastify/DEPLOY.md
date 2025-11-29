# Deploy Backend to Vercel

This guide shows how to deploy the FISE Fastify backend to Vercel using the **Vercel Dashboard**.

## ⚠️ Important: Dashboard Deployment Required

**You must deploy from the Vercel Dashboard** - this ensures proper monorepo configuration and workspace linking.

## 🚀 Deployment Steps

### Step 1: Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the repository containing this backend

### Step 2: Configure Project Settings

1. **Root Directory:** ⚠️ **CRITICAL**
   - Click **"Edit"** next to Root Directory
   - Set to: `backend-fastify`
   - This tells Vercel to treat `backend-fastify` as the project root

2. **Framework Preset:** 
   - Select **"Other"** or leave as auto-detected

3. **Build Command:** 
   - Leave **empty** (no build needed for serverless functions)

4. **Output Directory:** 
   - Leave **empty**

5. **Install Command:**
   - Leave **empty** (npm will auto-install from root)

6. **Environment Variables (Optional):**
   - No environment variables required for basic setup
   - Add any custom variables if needed

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your API will be available at: `https://your-project.vercel.app`

### Step 4: Test Your Deployment

```bash
# Test health endpoint
curl https://your-project.vercel.app/health

# Test protected endpoint
curl https://your-project.vercel.app/api/demo/protected
```

## 📋 Project Configuration

### Root Directory
- **Must be set to:** `backend-fastify`
- This ensures Vercel uses the correct `vercel.json` and workspace structure

### Vercel Configuration (`vercel.json`)

```json
{
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/api/server.js"
        }
    ],
    "functions": {
        "api/server.js": {
            "maxDuration": 30
        }
    }
}
```

**What this does:**
- Routes all requests to `/api/server.js` serverless function
- Sets 30-second timeout for function execution
- Uses modern Vercel functions API (no `builds` property)

### File Structure

```
backend-fastify/
├── api/
│   └── server.js          # Serverless function entry point
├── routes/                 # Route handlers
├── utils/                  # Utilities
├── server.js               # Local dev server (not deployed)
└── vercel.json             # Vercel configuration
```

## 🔧 How It Works

### Monorepo Setup

1. **Workspace Linking:**
   - Vercel runs `npm install` in `backend-fastify` directory
   - npm sees `"@fise-examples/shared": "file:../shared"` in `package.json`
   - npm automatically installs the local shared package from `../shared`
   - Shared package and its dependencies (including `fise`) are installed

2. **Serverless Function:**
   - `api/server.js` is deployed as a serverless function
   - All routes are handled by this single function
   - Fastify instance is initialized once (singleton pattern)

3. **Shared Package:**
   - `@fise-examples/shared` is resolved from `../shared` directory
   - All imports from `@fise-examples/shared` work correctly

## ✅ Post-Deployment Checklist

- [ ] Root directory set to `backend-fastify` in Vercel Dashboard
- [ ] Deployment successful (check build logs)
- [ ] Health endpoint works: `/health`
- [ ] API endpoints respond correctly
- [ ] CORS configured (allows frontend access)
- [ ] Deployment Protection disabled (for public API access)

## 🔄 Redeploy After Changes

### Automatic (Git Integration - Recommended)

1. Push changes to your Git repository
2. Vercel automatically detects changes
3. New deployment is triggered automatically
4. Preview deployments created for pull requests

### Manual Redeploy

1. Go to Vercel Dashboard → Your Project
2. Click **"Redeploy"** button
3. Select the branch/commit to deploy

## 🐛 Troubleshooting

### "Module not found: Cannot find package '@fise-examples/shared'"

**Cause:** Workspace not linked correctly

**Solutions:**
1. Verify Root Directory is set to `backend-fastify` (not root)
2. Check `package.json` uses `"file:../shared"` (not `"*"`)
3. Check build logs for npm install errors
4. Ensure `shared/` directory exists in repository

### "The `functions` property cannot be used with `builds`"

**Cause:** Using legacy `builds` property

**Solution:** ✅ Already fixed - `vercel.json` uses only `functions` property

### Function Timeout

**Cause:** Long-running operations

**Solutions:**
1. Current timeout is 30 seconds (configured in `vercel.json`)
2. For longer operations, upgrade to Vercel Pro (60s timeout)
3. Optimize slow endpoints

### CORS Errors

**Cause:** Deployment Protection or CORS misconfiguration

**Solutions:**
1. Disable Deployment Protection in Vercel Dashboard:
   - Settings → Deployment Protection → Disabled
2. Verify backend CORS allows all origins (already configured in code)
3. Check `VITE_API_BASE` in frontend points to correct backend URL

### Build Fails

**Cause:** Incorrect configuration or missing files

**Solutions:**
1. Verify Root Directory is `backend-fastify`
2. Check build logs in Vercel Dashboard for specific errors
3. Ensure `api/server.js` exists
4. Verify all route files are present

## 📚 Next Steps

1. **Deploy Frontend:** See [frontend-react/DEPLOY.md](../frontend-react/DEPLOY.md)
2. **Update Frontend API URL:** Set `VITE_API_BASE` to your backend URL
3. **Test Integration:** Verify frontend can connect to backend
4. **Monitor:** Check Vercel Analytics for usage

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Fastify on Vercel](https://vercel.com/docs/frameworks/fastify)

