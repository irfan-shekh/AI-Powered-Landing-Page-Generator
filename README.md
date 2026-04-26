# AI Landing Page Generator

A full-stack Next.js application that uses AI to generate high-converting landing pages.

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Next.js API Routes, Neon DB (PostgreSQL), Prisma ORM
- AI Integration: Vercel AI SDK, Google Gemini (gemini-2.5-flash) or (gemini-3-flash-preview)
- Authentication: Better Auth

## Local Development Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables in `.env`:
   - `DATABASE_URL`: Add your Neon DB connection string.
   - `BETTER_AUTH_SECRET`: Generate a secret via `openssl rand -base64 32`.
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Get an API key from Google AI Studio.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment Steps (Vercel)

1. Push your repository to GitHub.
2. Log into Vercel and click **Add New > Project**.
3. Import your GitHub repository.
4. Set the following Environment Variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (Set to your Vercel production domain, e.g., `https://your-app.vercel.app`)
   - `GOOGLE_GENERATIVE_AI_API_KEY`
5. Vercel will automatically run `npm run build` and deploy the application.

## Core Features
- **Authentication**: Secure login/signup using Better Auth.
- **AI Generation**: Custom prompt engineering with Vercel AI SDK to generate structured JSON.
- **Dynamic Renderer**: Converts JSON output into reusable React/Tailwind sections (`Hero`, `Features`, `Testimonials`, `Pricing`, `CTA`).
- **Dashboard**: Save generated pages to your PostgreSQL database to view later.
