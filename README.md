# Shelly LMS

A modern, responsive Learning Management System for BS Tourism Management.

## Features
- **Dashboard**: View courses and quick stats.
- **File Management**: Upload and view course materials.
- **Notes**: Offline-capable quick notes (saved to your device).
- **PWA**: Installable on mobile and desktop.

## getting Started

1.  **Install Dependencies** (if not done):
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1.  Push this code to a GitHub repository.
2.  Import the repository in [Vercel](https://vercel.com).
3.  Deploy!

### Important Note on File Storage
This project currently uses **local filesystem storage** for uploads (`public/uploads`).
- **Locally**: Works perfectly.
- **On Vercel**: Files uploaded will **disappear** when the app redeploys or sleeps, because Vercel functions are serverless and ephemeral.
- **Solution**: For permanent storage in production, connect this app to **Vercel Blob** or **Supabase Storage**.
