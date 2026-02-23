# SHX Web

This is a modern web application frontend built with [Next.js](https://nextjs.org) (App Router).

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file at the root of the project:

- `BACKEND_URL`: The internal URL of your backend API (e.g., `http://localhost:8080`).
- `NEXT_PUBLIC_BACKEND_URL`: The public-facing URL of your backend API accessible by the client browser (e.g., `http://localhost:8080`).
- `AUTH_SECRET`: A random secret key used by NextAuth.js to encrypt session tokens (e.g., generate one using `openssl rand -base64 33`).

## Tech Stack & Libraries Used

This project utilizes several powerful libraries and tools:

- **Framework:** [Next.js](https://nextjs.org) (v16) leveraging the modern App Router for robust routing and server-side rendering.
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (v5 beta) is used for secure user session management and authentication flows.
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) is implemented for robust, scalable global state management across the application.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4) for utility-first responsive styling and layout.
- **UI Components:** A rich, highly-accessible component ecosystem using [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/), and [Shadcn UI](https://ui.shadcn.com/).
- **Validation:** [Zod](https://zod.dev/) for TypeScript-first schema validation.
- **Icons & Toast Notifications:** [Lucide React](https://lucide.dev/) for crisp, scalable iconography and [Sonner](https://sonner.emilkowal.ski/) for toast notifications.

## How It Works

1. **Architecture:** The app is built on the Next.js App Router, separating Server and Client components to optimize performance and bundle sizes.
2. **Authentication Flow:** User authentication is managed server-side via NextAuth (`auth.ts`). Protected API routes and pages rely on active session checks securely encrypted by `AUTH_SECRET`.
3. **API Integration:** The frontend connects to an external backend service. Server-side requests use `BACKEND_URL`, while client-side requests use `NEXT_PUBLIC_BACKEND_URL`.
4. **State Management:** While Next.js handles server state routing, complex client-side interactions and shared application states are managed using Redux Toolkit slices.
5. **UI & Design:** The interface strictly utilizes a CSS approach via Tailwind, seamlessly integrated with accessible pre-built headless components from Radix UI and Shadcn.

## Getting Started: Setup and Run

To set up and run the frontend application locally, follow these steps:

1. **Install Dependencies:**
   Install all required Node.js packages using your preferred package manager:
   ```bash
   npm install
   # or
   yarn 
   # or
   pnpm install
   # or
   bun install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file at the root of the project directory based on the variables listed above. Example:
   ```env
   BACKEND_URL="http://localhost:8080"
   NEXT_PUBLIC_BACKEND_URL="http://localhost:8080"
   AUTH_SECRET="your-super-secret-key"
   ```

3. **Run the Development Server:**
   Start the application in development mode:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the running application.
