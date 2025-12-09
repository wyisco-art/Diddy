# Deployment Guide - Multiplayer Minesweeper

This guide covers multiple deployment options for your multiplayer minesweeper game.

## Quick Deployment Options

### Option 1: Render (Easiest - Free Tier Available) ⭐ RECOMMENDED

Render provides a simple deployment with a free tier for both frontend and backend.

#### Steps:

1. **Push your code to GitHub** (if not already done)

2. **Go to [Render Dashboard](https://dashboard.render.com/)**

3. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `minesweeper-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `claude/multiplayer-minesweeper-01GGNJkCY5k3yafmjiudLhpd` (or your main branch)
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `ALLOWED_ORIGINS`: `https://your-frontend-url.onrender.com` (you'll update this after deploying frontend)
   - Click "Create Web Service"
   - **Note the backend URL** (e.g., `https://minesweeper-backend.onrender.com`)

4. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `minesweeper-frontend`
     - **Branch**: Same as above
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Add Environment Variable:
     - `VITE_BACKEND_URL`: `https://minesweeper-backend.onrender.com` (use your actual backend URL)
   - Click "Create Static Site"

5. **Update Backend CORS:**
   - Go back to your backend service settings
   - Update `ALLOWED_ORIGINS` to your frontend URL (e.g., `https://minesweeper-frontend.onrender.com`)
   - The backend will automatically redeploy

6. **Done!** Your game is live at your frontend URL! 🎉

**Pros:**
- Free tier available
- Automatic SSL certificates
- Simple setup
- Auto-deploys on git push

**Cons:**
- Free tier spins down after 15 minutes of inactivity (cold starts ~30s)

---

### Option 2: Railway (Easy - $5/month after free trial)

Railway is similar to Render with a generous free trial and simple deployment.

#### Steps:

1. **Go to [Railway](https://railway.app/)**

2. **Create a new project**

3. **Deploy Backend:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Click "Add Service" → "Select the repo"
   - Configure:
     - **Root Directory**: `server`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `ALLOWED_ORIGINS`: `https://your-frontend-url.railway.app` (update after deploying frontend)
   - Railway will generate a domain like `minesweeper-backend.railway.app`

4. **Deploy Frontend:**
   - In the same project, click "New Service"
   - Select your repository again
   - Configure:
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run preview`
   - Add Environment Variable:
     - `VITE_BACKEND_URL`: Your backend Railway URL
   - Railway will generate a domain for your frontend

5. **Update Backend CORS:**
   - Go to backend service
   - Update `ALLOWED_ORIGINS` to your frontend Railway URL

**Pros:**
- Fast deployments
- Great developer experience
- Never sleeps (unlike Render free tier)
- Generous free trial ($5 credit/month)

**Cons:**
- No permanent free tier

---

### Option 3: Docker Compose (For any VPS/Cloud)

Use this if you have your own server (DigitalOcean, AWS, Linode, etc.)

#### Prerequisites:
- Docker and Docker Compose installed on your server
- Domain name pointed to your server (optional but recommended)

#### Steps:

1. **Clone your repository on the server:**
```bash
git clone <your-repo-url>
cd Diddy
git checkout claude/multiplayer-minesweeper-01GGNJkCY5k3yafmjiudLhpd
```

2. **Edit `docker-compose.yml`:**
   - Update `ALLOWED_ORIGINS` in backend to your domain
   - Update `VITE_BACKEND_URL` in frontend build args

3. **Run:**
```bash
docker-compose up -d
```

4. **Set up reverse proxy (optional but recommended):**

   Install nginx on your host:
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

   Create `/etc/nginx/sites-available/minesweeper`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

   Enable and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/minesweeper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

**Pros:**
- Full control
- No vendor lock-in
- Can be very cheap ($5-10/month)

**Cons:**
- Requires more technical knowledge
- You manage updates and security

---

### Option 4: Vercel (Frontend) + Render/Railway (Backend)

Deploy frontend to Vercel and backend separately.

#### Frontend on Vercel:

1. **Go to [Vercel](https://vercel.com/)**
2. Click "New Project" → Import your repository
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_BACKEND_URL`: Your backend URL
5. Deploy!

Then deploy backend using Render or Railway as described above.

**Pros:**
- Vercel has excellent global CDN
- Very fast frontend delivery
- Generous free tier

**Cons:**
- Need to manage two separate services

---

## Environment Variables Reference

### Backend (server)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port to run on | `3001` or `10000` (Render default) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend URLs | `https://your-app.com,https://www.your-app.com` |

### Frontend (client)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend WebSocket URL | `https://your-backend.com` or `wss://your-backend.com` |

---

## Testing Your Deployment

1. Open your frontend URL in a browser
2. Enter a player name and join
3. Open the same URL in an incognito window or different browser
4. Enter a different player name and join
5. Both players should see each other and be able to play together!

---

## Troubleshooting

### "Failed to join game" or connection errors
- Check that `VITE_BACKEND_URL` is set correctly (no trailing slash)
- Check that backend `ALLOWED_ORIGINS` includes your frontend URL
- Check browser console for CORS errors

### WebSocket connection fails
- Ensure your backend URL supports WebSocket (not just HTTP)
- For HTTPS frontends, backend must also use HTTPS (or wss://)
- Check firewall rules if self-hosting

### Game works locally but not in production
- Check all environment variables are set correctly
- Check browser console for errors
- Check backend logs for connection errors
- Ensure CORS is configured properly

### Players can't see each other
- This is likely a WebSocket issue
- Check that Socket.io is connecting (browser console)
- Verify backend is receiving connections (check logs)

---

## Custom Domain (Optional)

### For Render:
- Go to your service settings → "Custom Domain"
- Add your domain and follow DNS instructions

### For Railway:
- Go to your service settings → "Settings" → "Domains"
- Add your custom domain

### For Vercel:
- Go to your project → "Settings" → "Domains"
- Add your custom domain

Remember to update `ALLOWED_ORIGINS` on your backend after adding a custom domain!

---

## Monitoring & Maintenance

### Logs
- **Render**: Dashboard → Your Service → "Logs" tab
- **Railway**: Project → Service → "Deployments" → Click deployment
- **Docker**: `docker-compose logs -f`

### Updates
Push to your repository and services will auto-deploy (if configured).

For Docker:
```bash
git pull
docker-compose down
docker-compose up -d --build
```

---

## Need Help?

- Check the logs first (most issues show up there)
- Verify environment variables are set correctly
- Test locally first: `npm run dev`
- Check that your git branch is correct
- Ensure dependencies are installed: `npm install`

**Common gotchas:**
- WebSocket URLs need `ws://` or `wss://` (or just `https://` - Socket.io handles it)
- CORS must allow your frontend domain
- Free tiers may have cold starts (first request is slow)
- Ensure you're using the correct branch when deploying
