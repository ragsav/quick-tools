---
description: How to deploy the Astro project to Cloudflare Pages via GitHub
---

Follow these steps to deploy your project:

1. **Push your code to GitHub**:
   Ensure all your latest changes (including the domain updates and favicon assets) are pushed to your GitHub repository.

2. **Connect to Cloudflare Pages**:
   - Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your GitHub account and the `quick-tools` repository.

3. **Configure Build Settings**:
   - **Framework preset**: Select `Astro`.
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: Ensure it's at least v18.14.1 (Cloudflare usually defaults to a recent version, but you can set `NODE_VERSION` in environment variables if needed).

4. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare will build your project and provide a `*.pages.dev` URL.

5. **Custom Domain**:
   - Once the deployment is successful, go to the **Custom domains** tab in your Pages project.
   - Click **Set up a custom domain** and enter `quicktools.live`.
   - Cloudflare will guide you through updating your DNS settings to point to the Pages deployment.
