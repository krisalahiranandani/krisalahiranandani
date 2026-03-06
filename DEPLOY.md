# Krisala Hiranandani Deployment Guide

The website is fully optimized and ready for production deployment.

## Security Headers
Strict security headers (CSP, HSTS, X-Frame-Options, XSS Protection) have been configured for instant deployment on modern platforms.
- **Vercel**: Configuration is ready in `vercel.json`.
- **Netlify**: Configuration is ready in `netlify.toml`.

Your CSP allows:
- Scripts: `unpkg.com` (for Phosphor icons)
- Styles/Fonts: `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`
- Images: `images.unsplash.com`, `maharera.mahaonline.gov.in`, `data:` URIs

## Production Build (Optional)
If you want to serve minified assets to achieve the absolute maximum Lighthouse score:

1. Ensure Node.js is installed.
2. Run `npm install`
3. Run `npm run build`
4. The `dist/` folder will contain your globally optimized production site.
5. *Note: If you use the `dist/` folder, ensure you update the HTML files in `dist/` to reference `style.min.css` and `app.min.js` instead of the unminified versions.* For standard Vercel/Netlify deployments, the unminified files with Brotli compression (handled by the platform) are usually sufficient for 95+ scores.

## Final Lighthouse Readiness
- Semantic HTML tags used correctly.
- Lazy-loading with blur-up effect active on all large images.
- PWA manifest and service worker with offline caching active.
- ARIA labels and alt tags applied.
