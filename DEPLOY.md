# Deploying SAYO Digital Menu

## What to upload

After running **`npm run build`**, upload the **contents** of the `dist/` folder to your server. No Node.js or npm is required on the server.

### Build (on your machine)

```bash
npm install
npm run build
```

This creates/updates the `dist/` folder.

### What’s in `dist/`

- `index.html` – entry page
- `assets/` – JS, CSS, and images (hashed filenames)
- `favicon.svg` (and any other files from `public/`)

Upload **everything inside `dist/`** (e.g. `index.html` and the `assets/` folder) to the **document root** of your web server (e.g. `public_html/`, `www/`, or `htdocs/`).

## Server requirements

- Any static file server (Apache, Nginx, Netlify, Vercel, etc.).
- **Single-page app (SPA) routing:** if the app uses client-side routes (e.g. `/menu`, `/about`), the server must serve `index.html` for all paths so the React app can handle routing.

### Apache (`.htaccess`)

If you use Apache and the app doesn’t load on refresh or direct URL:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Deploying to a subfolder

If the site is served from e.g. `https://example.com/menu/`, set the base in `vite.config.ts` before building:

```ts
export default defineConfig({
  base: '/menu/',
  // ...rest
})
```

Then run `npm run build` again and upload the new `dist/` contents under the `/menu/` path.
