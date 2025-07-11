# 🚀 Deployment Guide

This guide covers deploying the Dice Roller web app to various platforms.

## 📦 Prerequisites

Before deploying, ensure you have:

1. **Built the project**: `npm run build`
2. **Generated PWA icons** (optional but recommended):
   - `public/icon-192x192.png`
   - `public/icon-512x512.png`

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest option for Next.js apps:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Or connect to GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy automatically

**Benefits**:
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ PWA support
- ✅ Free tier available

### 2. Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy options**:
   - **Drag & Drop**: Upload the `.next` folder to Netlify
   - **Git Integration**: Connect your GitHub repository
   - **CLI**: Use `netlify-cli`

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3. Railway

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

### 4. Render

1. **Connect your repository** to Render
2. **Configure**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node

### 5. GitHub Pages

1. **Add to package.json**:
   ```json
   {
     "scripts": {
       "export": "next build && next export"
     }
   }
   ```

2. **Build for static export**:
   ```bash
   npm run export
   ```

3. **Deploy the `out` folder** to GitHub Pages

## 🔧 Environment Variables

For production, you may want to set:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📱 PWA Configuration

### Manifest File
The `public/manifest.json` file is already configured for PWA support.

### Service Worker
The service worker is automatically registered by `next-pwa`.

### Icons
Ensure you have the required icons:
- `public/icon-192x192.png`
- `public/icon-512x512.png`

## 🧪 Testing Deployment

After deployment, test:

1. **Basic functionality**:
   - Rolling dice
   - Creating custom dice
   - Viewing history
   - Game templates

2. **PWA features**:
   - Install prompt appears
   - Works offline
   - App icon displays correctly

3. **Mobile responsiveness**:
   - Works on different screen sizes
   - Touch interactions work properly

## 🔍 Troubleshooting

### Common Issues

1. **PWA not installing**:
   - Check manifest.json is accessible
   - Verify icons exist and are accessible
   - Ensure HTTPS is enabled

2. **Build errors**:
   - Check TypeScript errors: `npm run lint`
   - Verify all dependencies are installed
   - Check for missing environment variables

3. **Performance issues**:
   - Enable compression on your hosting platform
   - Use a CDN for static assets
   - Optimize images

### Support

If you encounter issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the [next-pwa documentation](https://github.com/shadowwalker/next-pwa)
3. Check your hosting platform's documentation

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All features work correctly
- [ ] PWA installation works
- [ ] Mobile responsiveness is tested
- [ ] Performance is acceptable
- [ ] HTTPS is enabled
- [ ] Analytics are configured (if desired)
- [ ] Error monitoring is set up (if desired)

---

**Happy deploying! 🚀** 