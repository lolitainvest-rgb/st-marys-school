# St Mary's Primary School Website

A modern, responsive website for St Mary's English Medium Primary School, built with **Next.js 14** and **Tailwind CSS**.

## Features

- **Home Page**: Hero banner, Principal's Welcome, and scrolling News Ticker.
- **Admissions**: Detailed fee structure and application requirements.
- **Calendar**: Sortable list of academic, sporting, and cultural events.
- **Gallery**: Photo grid showcasing school activities.
- **Contact**: Interactive contact form and location details.
- **Admin Portal**: Secure dashboard to manage content (News, Calendar, Gallery).

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **CMS**: Supabase (Integration ready - currently using Mock Data for UI demo)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Install Node.js**: Ensure you have Node.js installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.

    > **Windows Users Note:** If you see a red error about "running scripts is disabled", try running this command instead:
    > ```bash
    > npm.cmd run dev
    > ```
    > Or switch your VS Code terminal from **PowerShell** to **Command Prompt**.

## Admin Portal Access

To access the CMS dashboard:
1.  Navigate to `/login` (e.g., `http://localhost:3000/login`).
2.  Use the demo credentials:
    - **Email**: `admin@stmarys.co.bw`
    - **Password**: `admin123`

## Content Updates (Future Integration)

Once Supabase is fully connected:
- **News**: Go to "Manage News" to post announcements.
- **Gallery**: Upload images directly in "Manage Gallery".
- **Events**: Add term dates in "Manage Calendar".

## Deployment

This project is optimized for deployment on **Cloudflare Pages** or **Vercel**.

1.  Push code to GitHub.
2.  Connect repository to Cloudflare Pages/Vercel.
3.  Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
4.  Deploy!
