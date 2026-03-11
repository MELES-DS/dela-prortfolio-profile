# Deployment Guide

This project is optimized for deployment on **Vercel** or **Netlify**, both of which offer generous free tiers and custom domain support.

## Option 1: Vercel (Recommended)

1. **Push your code to GitHub**, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com/) and sign up.
3. Click **"Add New"** > **"Project"**.
4. Import your repository.
5. In the **Build & Development Settings**:
   - Framework Preset: `Vite` (automatically detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**.

### Adding a Custom Domain on Vercel
1. Go to your Project Dashboard on Vercel.
2. Click **Settings** > **Domains**.
3. Enter your domain name (e.g., `www.yourname.com`).
4. Follow the DNS instructions provided by Vercel to update your domain's A/CNAME records.

---

## Option 2: Netlify

1. **Push your code to GitHub**.
2. Go to [Netlify](https://www.netlify.com/) and sign up.
3. Click **"Add new site"** > **"Import an existing project"**.
4. Connect your Git provider and select your repo.
5. In the **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**.

### Adding a Custom Domain on Netlify
1. Go to **Site Configuration** > **Domain management**.
2. Click **Add domain alias** or **Add custom domain**.
3. Enter your domain and follow the DNS configuration steps.

---

## Environment Variables (Optional but Recommended)

If you want to keep your Supabase credentials secure or change them without modifying code:
1. In your hosting dashboard (Vercel or Netlify), find the **Environment Variables** section.
2. Add the following:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

---

## Troubleshooting

- **Page Refresh 404**: This project includes `vercel.json` and `netlify.toml` which handle the "Single Page Application" routing. If you see a 404 when refreshing a sub-page, ensure these files are in your root directory.
- **Supabase Connection**: Ensure your Supabase URL and Key are correct. If you used Environment Variables, make sure they start with `VITE_`.