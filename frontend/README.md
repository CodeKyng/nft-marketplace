# The Monarch Guild frontend

Vite, React, Tailwind CSS, and local ShadCN-style UI components.

## Local setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

The Vite variables in `.env.local` configure the Base Sepolia contract links and Firebase web app. Set the same `VITE_FIREBASE_*` variables in the frontend host's build environment for a production build. Firebase web app configuration is client-side; never put Firebase Admin credentials or other server secrets in Vite variables.

In Firebase Console, enable **Email/Password** under Authentication sign-in providers. Add the deployed website's domain under Authentication authorized domains.

## Authentication flow

- `/signup` creates an email/password Firebase account, saves the display name to the Firebase Auth profile, and sends an email verification message.
- `/login` signs in and includes password reset email handling.
- `/account` requires a signed-in session and offers verification status, resend verification, and sign out.
- Firebase auth state is restored from local browser persistence. Signing in or creating an account routes to `/account`.

## Build

```powershell
npm run build
```
