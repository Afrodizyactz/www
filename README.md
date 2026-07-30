# AfrodizzyCasts website

Responsive static website for [afrodizzycasts.co.za](https://afrodizzycasts.co.za), designed for GitHub Pages.

## Included

- Mobile-first responsive landing page
- Casting services, process, story and enquiry sections
- Accessible navigation, forms and reduced-motion support
- Search and social metadata
- POPIA-oriented privacy notice
- Custom domain configuration, sitemap, robots file and 404 page
- No build step or framework dependency

## Formspree setup

The casting brief currently falls back to a pre-filled email addressed to `info@afrodizzycasts.co.za`, so it remains usable without a backend.

To send leads directly through Formspree:

1. Create a form in the Formspree dashboard.
2. Set its target email to `info@afrodizzycasts.co.za`.
3. Copy the endpoint from the Formspree Integration screen.
4. Open `assets/app.js` and replace the empty `FORMSPREE_ENDPOINT` value with the endpoint, for example:

   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id";
   ```

## Local preview

Run a local static server from the repository root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.
