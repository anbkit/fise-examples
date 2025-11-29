# Vercel Deployment Guide

This guide explains how to deploy both the backend and frontend to Vercel using the **Vercel Dashboard**.

## ⚠️ Important: Dashboard Deployment Required

**You must deploy from the Vercel Dashboard** - this ensures:
- Proper monorepo configuration
- Correct workspace linking
- Environment variable management
- Automatic deployments on Git push

## 📋 Overview

This monorepo contains two separate applications that must be deployed as **two separate Vercel projects**:

| Application  | Root Directory    | Project Type       | Documentation                                            |
| ------------ | ----------------- | ------------------ | -------------------------------------------------------- |
| **Backend**  | `backend-fastify` | Serverless API     | [backend-fastify/DEPLOY.md](./backend-fastify/DEPLOY.md) |
| **Frontend** | `frontend-react`  | Static Site (Vite) | [frontend-react/DEPLOY.md](./frontend-react/DEPLOY.md)   |

## 🚀 Quick Start

### 1. Deploy Backend First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. **Configure:**
   - **Root Directory:** `backend-fastify` ⚠️ **CRITICAL**
   - **Framework:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
5. Click **"Deploy"**
6. Note your backend URL (e.g., `https://your-backend.vercel.app`)

📖 **Full Guide:** [backend-fastify/DEPLOY.md](./backend-fastify/DEPLOY.md)

### 2. Deploy Frontend Second

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"** (create a **new project**)
3. Import the **same** Git repository
4. **Configure:**
   - **Root Directory:** `frontend-react` ⚠️ **CRITICAL**
   - **Framework:** Vite (auto-detected)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
5. **Environment Variables:**
   - Add `VITE_API_BASE` = Your backend URL from step 1
   - Apply to: Production, Preview, Development
6. Click **"Deploy"**

📖 **Full Guide:** [frontend-react/DEPLOY.md](./frontend-react/DEPLOY.md)

## 🔑 Key Configuration Points

### Backend Configuration

- **Root Directory:** Must be `backend-fastify`
- **No Build Command:** Serverless functions don't need building
- **Function Location:** `api/server.js` (Vercel auto-detects)
- **Timeout:** 30 seconds (configured in `vercel.json`)

### Frontend Configuration

- **Root Directory:** Must be `frontend-react`
- **Environment Variable:** `VITE_API_BASE` must be set to backend URL
- **Build Output:** `dist/` directory
- **SPA Routing:** All routes rewrite to `index.html`

## 🔄 Automatic Deployments

Once configured via Dashboard:

1. **Push to Git:** Changes automatically trigger deployments
2. **Pull Requests:** Preview deployments created automatically
3. **Production:** Main branch deploys to production
4. **No CLI needed:** Everything happens automatically

## 🐛 Common Issues

### "Module not found: Cannot find package '@fise-examples/shared'"

**Solution:**
1. Verify Root Directory is correct (`backend-fastify` or `frontend-react`)
2. Check `package.json` uses `"file:../shared"` (not `"*"`)
3. Check build logs for npm install errors

### "The `functions` property cannot be used with `builds`"

**Solution:** ✅ Already fixed - `vercel.json` uses only `functions` property

### Frontend can't connect to backend

**Solution:**
1. Verify `VITE_API_BASE` is set in Vercel Dashboard
2. Check backend URL is correct
3. Ensure backend Deployment Protection is disabled
4. Check CORS configuration in backend

### CORS Errors

**Solution:**
1. Disable Deployment Protection in backend project:
   - Settings → Deployment Protection → Disabled
2. Verify backend CORS allows all origins (already configured)

## 📚 Detailed Documentation

- **Backend Deployment:** [backend-fastify/DEPLOY.md](./backend-fastify/DEPLOY.md)
- **Frontend Deployment:** [frontend-react/DEPLOY.md](./frontend-react/DEPLOY.md)

## ✅ Post-Deployment Checklist

### Backend
- [ ] Root directory set to `backend-fastify`
- [ ] Deployment successful
- [ ] Health endpoint works: `/health`
- [ ] API endpoints respond
- [ ] Deployment Protection disabled

### Frontend
- [ ] Root directory set to `frontend-react`
- [ ] `VITE_API_BASE` environment variable set
- [ ] Deployment successful
- [ ] Home page loads
- [ ] API calls work
- [ ] No console errors

## 🔗 Resources

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Monorepo Docs](https://vercel.com/docs/monorepos)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

