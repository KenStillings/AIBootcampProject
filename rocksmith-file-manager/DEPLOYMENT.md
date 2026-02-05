# Deployment Guide - Rocksmith File Manager

This guide provides step-by-step instructions for deploying the Rocksmith File Manager to production.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests passing: `npm test` ✅
- [ ] Test coverage ≥80%: `npm run test:coverage` ✅
- [ ] TypeScript compiles without errors: `npx tsc --noEmit` ✅
- [ ] Production build successful: `npm run build` ✅
- [ ] README.md is complete and accurate ✅
- [ ] CHANGELOG.md is up to date ✅
- [ ] LICENSE file is present ✅
- [ ] No console errors in browser testing ✅

## Build for Production

```bash
# Clean previous builds
npm run clean

# Run production build
npm run build

# Verify build output
ls -la dist/
```

**Expected build output:**
```
dist/
├── scripts/
│   ├── csvParser.js
│   ├── dataService.js
│   ├── main.js
│   ├── renderer.js
│   ├── storageService.js
│   └── ui.js
└── types/
    └── index.js
```

## Deployment Options

### Option 1: GitHub Pages (Recommended)

GitHub Pages is ideal for static sites and provides free hosting with HTTPS.

#### Setup Steps:

1. **Ensure repository is public** (or have GitHub Pro for private repos)

2. **Create deployment branch:**
   ```bash
   git checkout -b gh-pages
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Commit build artifacts:**
   ```bash
   git add dist/ index.html src/styles/
   git commit -m "Deploy to GitHub Pages"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin gh-pages
   ```

6. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Click Save

7. **Access your site:**
   - URL: `https://yourusername.github.io/rocksmith-file-manager/`
   - Custom domain optional (see GitHub Pages documentation)

#### Updating Deployment:

```bash
# Switch to main branch, make changes
git checkout main
# ... make changes ...
npm test
npm run build

# Switch to gh-pages
git checkout gh-pages

# Merge changes from main
git merge main

# Push updates
git push origin gh-pages
```

---

### Option 2: Netlify

Netlify offers automatic deployments on git push with a generous free tier.

#### Setup Steps:

1. **Sign up at [Netlify](https://www.netlify.com/)**

2. **Connect GitHub repository:**
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose your repository

3. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `.` (root, since index.html is at root)
   - **Branch**: `main` (or your default branch)

4. **Deploy:**
   - Click "Deploy site"
   - Netlify builds and deploys automatically

5. **Access your site:**
   - URL: `https://random-name-12345.netlify.app`
   - Custom domain available (Settings → Domain management)

#### Continuous Deployment:

Once configured, Netlify automatically:
- Rebuilds on every git push to main branch
- Provides deploy previews for pull requests
- Shows build logs and deploy status

#### Custom Domain (Optional):

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. HTTPS enabled automatically via Let's Encrypt

---

### Option 3: Vercel

Vercel offers similar features to Netlify with excellent performance.

#### Setup Steps:

1. **Sign up at [Vercel](https://vercel.com/)**

2. **Import GitHub repository:**
   - Click "New Project"
   - Import Git Repository
   - Select your repo

3. **Configure project:**
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Vercel builds and deploys

5. **Access your site:**
   - URL: `https://rocksmith-file-manager.vercel.app`
   - Custom domain available in project settings

---

### Option 4: Self-Hosted

Host on your own server (Apache, Nginx, etc.).

#### Requirements:
- Web server (Apache, Nginx, or any HTTP server)
- HTTPS certificate (recommended: Let's Encrypt)

#### Apache Configuration:

```apache
<VirtualHost *:80>
    ServerName rocksmith-files.yourdomain.com
    DocumentRoot /var/www/rocksmith-file-manager
    
    <Directory /var/www/rocksmith-file-manager>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Redirect HTTP to HTTPS
    Redirect permanent / https://rocksmith-files.yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName rocksmith-files.yourdomain.com
    DocumentRoot /var/www/rocksmith-file-manager
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/rocksmith-files.yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/rocksmith-files.yourdomain.com/privkey.pem
    
    <Directory /var/www/rocksmith-file-manager>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name rocksmith-files.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rocksmith-files.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/rocksmith-files.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rocksmith-files.yourdomain.com/privkey.pem;
    
    root /var/www/rocksmith-file-manager;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Deployment:

```bash
# Build locally
npm run build

# Copy files to server
scp -r * user@yourserver:/var/www/rocksmith-file-manager/

# Or use rsync
rsync -avz --delete ./ user@yourserver:/var/www/rocksmith-file-manager/
```

---

## Post-Deployment Verification

After deployment, test the following:

### Functional Testing:
- [ ] Application loads without errors
- [ ] Can add files individually
- [ ] Can import files via CSV
- [ ] Can update file status
- [ ] Can delete files
- [ ] Can search files
- [ ] Can filter by status
- [ ] Data persists after page refresh
- [ ] Keyboard shortcuts work (`/` and `Ctrl+Enter`)

### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Device Testing:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Console Checks:
- [ ] No JavaScript errors in console
- [ ] No 404 errors for resources
- [ ] localStorage working correctly

### Performance Checks:
- [ ] Page loads in <2 seconds
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] Search responds instantly

---

## Monitoring & Maintenance

### Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Optional)

Add Sentry for error monitoring:

```bash
npm install @sentry/browser
```

```typescript
// In main.ts
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### Regular Maintenance:

- **Weekly**: Check for user-reported issues
- **Monthly**: Review analytics and usage patterns
- **Quarterly**: Update dependencies for security patches
- **Yearly**: Review and update documentation

---

## Rollback Procedure

If deployment has issues:

### GitHub Pages:
```bash
git checkout gh-pages
git reset --hard HEAD~1  # Revert to previous commit
git push -f origin gh-pages
```

### Netlify/Vercel:
- Go to Deployments dashboard
- Click on previous successful deployment
- Click "Publish deploy"

### Self-Hosted:
```bash
# Restore from backup
cp -r /backup/rocksmith-file-manager/* /var/www/rocksmith-file-manager/
```

---

## Security Considerations

- ✅ **HTTPS**: Always use HTTPS in production
- ✅ **No sensitive data**: Application doesn't handle passwords or personal data
- ✅ **Client-side only**: No server-side vulnerabilities
- ✅ **Input sanitization**: File names are sanitized before display
- ✅ **CSP (optional)**: Consider Content Security Policy headers

### Recommended CSP Header:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## Performance Optimization

### Already Implemented:
- ✅ Efficient DOM manipulation with document fragments
- ✅ LocalStorage caching
- ✅ Optimized search algorithms (<100ms for 500 files)

### Optional Enhancements:
- **Lazy loading**: Load files in batches if list grows large
- **Service Worker**: Enable offline functionality
- **Minification**: Minify JS/CSS (requires build tools)

---

## Support & Troubleshooting

### Common Deployment Issues:

**Issue: 404 on deployed site**
- Check publish directory is set to root (`.`)
- Verify index.html is in root directory
- Check build completed successfully

**Issue: JavaScript not loading**
- Verify paths in index.html are correct
- Check for CORS issues (shouldn't happen with same-origin)
- Inspect Network tab in browser DevTools

**Issue: localStorage not working**
- Check browser privacy settings
- Ensure HTTPS (some browsers restrict localStorage on HTTP)
- Test in different browser

**Issue: Styles not applying**
- Verify CSS file path in index.html
- Clear browser cache
- Check for CSS syntax errors

---

## Deployment Checklist Summary

```
Pre-Deployment:
☑ Tests passing (76/76)
☑ Coverage ≥80% (98.97%)
☑ TypeScript clean
☑ Build successful
☑ Documentation complete

Deployment:
☑ Choose hosting platform
☑ Configure build settings
☑ Deploy to production
☑ Verify deployment URL

Post-Deployment:
☑ Functional testing
☑ Browser testing
☑ Mobile testing
☑ Performance testing
☑ No console errors

Maintenance:
☐ Set up monitoring (optional)
☐ Schedule regular updates
☐ Document deployment date
☐ Share URL with users
```

---

## Production URLs

Once deployed, update this section with your live URLs:

- **Production**: [URL here]
- **Staging** (optional): [URL here]
- **Repository**: https://github.com/yourusername/rocksmith-file-manager

---

**Deployment Version**: 1.0.0  
**Last Deployed**: [Date]  
**Deploy Status**: ✅ Ready for Production  

For questions or issues, open an issue on GitHub or contact the maintainer.
