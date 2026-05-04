<div align="center">

<img src="https://raw.githubusercontent.com/HoussemEddineChaouch/voyago/main/frontend/src/assets/logo.png" alt="Voyago Logo" width="80" />

# Voyago

A full-stack travel booking platform built with Angular 17 and Node.js.
Curated trips designed by people who actually travel. Less browsing, more boarding.

<br/>

[![Angular](https://img.shields.io/badge/Angular_17-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Stripe Test Cards](#stripe-test-cards)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Voyago is a production-ready travel booking platform where users discover curated
voyages, filter by destination and budget, book trips with real Stripe payments,
and manage bookings from a personal dashboard.

Administrators have a dedicated panel to manage all bookings, voyages, and
destinations with full CRUD operations, image uploads, and automatic Stripe
refunds when cancelling paid bookings.

---

## Features

### Users

- Register with email and OTP verification
- Sign in with Google OAuth or email and password
- Browse and filter voyages by destination, max price, and departure date
- View detailed voyage pages with inclusions, ratings, and availability
- Book a voyage through a two-step Stripe payment flow
- View and manage personal bookings from the dashboard
- Cancel pending bookings
- Forgot password via email OTP then reset
- Edit profile name, phone, and country

### Administrators

- Dedicated admin panel at /admin
- Stats overview: total bookings, pending, unique customers, revenue
- View all bookings with inline status management
- Automatic Stripe refund when a paid booking is cancelled
- Create, edit, and delete voyages with image upload and featured toggle
- Create, edit, and delete destinations with image upload

### Technical Highlights

- Angular 17 standalone components with lazy-loaded routes
- Angular Signals for reactive state management
- JWT authentication with Angular HTTP interceptor
- Role-based route guards for auth and admin
- Stripe webhook listener updates booking status to PAID automatically
- Multer handles image uploads served as static assets
- Google OAuth via Passport.js with JWT redirect on success
- Automatic Stripe refund on booking cancellation via Refunds API

---

## Tech Stack

### Frontend

<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="48" height="48" alt="Angular"/>
      <br/><b>Angular 17</b>
      <br/><sub>Framework</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript"/>
      <br/><b>TypeScript 5</b>
      <br/><sub>Language</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="48" height="48" alt="Tailwind"/>
      <br/><b>Tailwind CSS</b>
      <br/><sub>Styling</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.brandfetch.io/idxAg10C0L/theme/dark/symbol.svg" width="48" height="48" alt="Stripe"/>
      <br/><b>Stripe.js</b>
      <br/><sub>Payments</sub>
    </td>
  </tr>
</table>

### Backend

<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js"/>
      <br/><b>Node.js 20</b>
      <br/><sub>Runtime</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="48" height="48" alt="Express"/>
      <br/><b>Express 4</b>
      <br/><sub>REST API</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="48" height="48" alt="MongoDB"/>
      <br/><b>MongoDB 7</b>
      <br/><sub>Database</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript"/>
      <br/><b>TypeScript 5</b>
      <br/><sub>Language</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.brandfetch.io/idxAg10C0L/theme/dark/symbol.svg" width="48" height="48" alt="Stripe"/>
      <br/><b>Stripe</b>
      <br/><sub>Payments & Refunds</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" width="48" height="48" alt="Google"/>
      <br/><b>Passport.js</b>
      <br/><sub>Google OAuth</sub>
    </td>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/expressjs/multer/master/logo.png" width="48" height="48" alt="Multer" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'"/>
      <br/><b>Multer</b>
      <br/><sub>File Uploads</sub>
    </td>
    <td align="center" width="120">
      <img src="https://raw.githubusercontent.com/nodemailer/nodemailer/master/assets/nm_logo_200x136.png" width="48" height="48" alt="Nodemailer" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'"/>
      <br/><b>Nodemailer</b>
      <br/><sub>Email OTP</sub>
    </td>
  </tr>
</table>

---

## Project Structure

```
voyago/
├── .gitignore
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── passport.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── destination.controller.ts
│   │   │   └── voyage.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── role.middleware.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Destination.ts
│   │   │   └── Voyage.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── destination.routes.ts
│   │   │   ├── voyage.routes.ts
│   │   │   └── payment.routes.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
└── frontend/
    ├── angular.json
    ├── tailwind.config.js
    ├── package.json
    └── src/
        └── app/
            ├── components/
            │   ├── navbar/
            │   ├── footer/
            │   ├── voyage-card/
            │   └── destination-card/
            ├── pages/
            │   ├── home/
            │   ├── voyages/
            │   ├── voyage-detail/
            │   ├── destinations/
            │   ├── booking/
            │   ├── booking-detail/
            │   ├── dashboard/
            │   ├── edit-profile/
            │   ├── auth/
            │   │   └── forgot-password/
            │   └── admin/
            │       ├── admin-dashboard/
            │       ├── voyage-form/
            │       └── destination-form/
            ├── services/
            ├── models/
            ├── guards/
            ├── interceptors/
            └── environments/
                ├── environment.example.ts
                ├── environment.ts           (gitignored)
                └── environment.prod.ts      (gitignored)
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account or local MongoDB
- Stripe account (test mode is sufficient)
- Gmail account with an App Password enabled for SMTP
- Google Cloud project with OAuth 2.0 credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/HoussemEddineChaouch/voyago.git
cd voyago
```

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in every variable. See the Environment Variables
section for descriptions.

```bash
npm run dev
```

The backend runs on http://localhost:5000

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp src/app/environments/environment.example.ts src/app/environments/environment.ts
cp src/app/environments/environment.example.ts src/app/environments/environment.prod.ts
```

Edit `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000",
  stripePublishableKey: "pk_test_YOUR_KEY",
};
```

```bash
ng serve
```

The frontend runs on http://localhost:4200

---

### 4. Stripe webhook setup

Install the Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows — download from https://github.com/stripe/stripe-cli/releases
```

Login and forward webhooks to the backend:

```bash
stripe login
stripe listen --forward-to localhost:5000/payments/webhook
```

Copy the printed `whsec_...` value into `backend/.env` as
`STRIPE_WEBHOOK_SECRET` and restart the backend.

---

### 5. Create an admin account

1. Register through the app
2. Open MongoDB Atlas and navigate to the users collection
3. Set `role` to `"ADMIN"` on your user document
4. Log out and log back in
5. The Admin link appears in the navbar

---

## Environment Variables

### Backend — `backend/.env`

| Variable              | Description                                              |
| --------------------- | -------------------------------------------------------- |
| PORT                  | Port the server listens on                               |
| MONGO_URI             | Full MongoDB Atlas connection string                     |
| JWT_SECRET            | Long random string used to sign tokens                   |
| JWT_EXPIRES_IN        | Token lifetime, e.g. `7d`                                |
| GOOGLE_CLIENT_ID      | OAuth 2.0 client ID from Google Cloud Console            |
| GOOGLE_CLIENT_SECRET  | OAuth 2.0 client secret from Google Cloud Console        |
| GOOGLE_CALLBACK_URL   | Must match the redirect URI registered in Google Console |
| EMAIL_HOST            | SMTP host, e.g. `smtp.gmail.com`                         |
| EMAIL_PORT            | SMTP port, e.g. `587`                                    |
| EMAIL_USER            | Sender email address                                     |
| EMAIL_PASS            | Gmail App Password, not your account password            |
| STRIPE_SECRET_KEY     | Stripe secret key from the dashboard                     |
| STRIPE_WEBHOOK_SECRET | Signing secret printed by the Stripe CLI listener        |
| CLIENT_URL            | Frontend origin for CORS, e.g. `http://localhost:4200`   |

### Frontend — `src/app/environments/environment.ts`

| Variable             | Description                                           |
| -------------------- | ----------------------------------------------------- |
| production           | `false` for development, `true` for production build  |
| apiUrl               | Backend base URL without trailing slash               |
| stripePublishableKey | Stripe publishable key, safe to expose in the browser |

---

## API Reference

### Auth

| Method | Endpoint              | Access | Description                   |
| ------ | --------------------- | ------ | ----------------------------- |
| POST   | /auth/register        | Public | Register new account          |
| POST   | /auth/login           | Public | Login and receive JWT         |
| POST   | /auth/verify-otp      | Public | Verify email OTP              |
| POST   | /auth/forgot-password | Public | Send password reset OTP       |
| POST   | /auth/reset-password  | Public | Reset password using OTP      |
| GET    | /auth/me              | Token  | Get full current user profile |
| PUT    | /auth/profile         | Token  | Update name, phone, country   |
| GET    | /auth/google          | Public | Start Google OAuth            |
| GET    | /auth/google/callback | Public | Google OAuth callback         |

### Destinations

| Method | Endpoint          | Access | Description          |
| ------ | ----------------- | ------ | -------------------- |
| GET    | /destinations     | Public | Get all destinations |
| POST   | /destinations     | Admin  | Create destination   |
| PUT    | /destinations/:id | Admin  | Update destination   |
| DELETE | /destinations/:id | Admin  | Delete destination   |

### Voyages

| Method | Endpoint       | Access | Description                       |
| ------ | -------------- | ------ | --------------------------------- |
| GET    | /voyages       | Public | Get all voyages, supports filters |
| GET    | /voyages/:slug | Public | Get single voyage by slug         |
| POST   | /voyages       | Admin  | Create voyage                     |
| PUT    | /voyages/:id   | Admin  | Update voyage                     |
| DELETE | /voyages/:id   | Admin  | Delete voyage                     |

### Bookings

| Method | Endpoint      | Access | Description                             |
| ------ | ------------- | ------ | --------------------------------------- |
| POST   | /bookings     | Token  | Create booking and Stripe PaymentIntent |
| GET    | /bookings     | Token  | Own bookings, admin sees all            |
| DELETE | /bookings/:id | Token  | Cancel and refund if PAID               |
| PATCH  | /bookings/:id | Admin  | Update booking status                   |

### Payments

| Method | Endpoint          | Access           | Description          |
| ------ | ----------------- | ---------------- | -------------------- |
| POST   | /payments/webhook | Stripe signature | Handle Stripe events |

---

## Stripe Test Cards

| Card Number         | Result             |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Payment succeeds   |
| 4000 0000 0000 0002 | Card declined      |
| 4000 0025 0000 3155 | Requires 3D Secure |

Use any future expiry date, any 3-digit CVC, and any 5-digit postal code.

---

## Scripts

### Backend

```bash
npm run dev      # Development server with nodemon
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled output for production
```

### Frontend

```bash
ng serve                                # Development server
ng build                                # Development build
ng build --configuration production     # Production build
```

---

## Contributing

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit with a conventional message

```bash
git commit -m "feat: describe your change"
```

4. Push the branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request on GitHub

---

## License

MIT License — see LICENSE file for details.

---

<div align="center">
Built by <b>Houssemeddine Chaouch</b>
<br/>
<a href="https://github.com/HoussemEddineChaouch">github.com/HoussemEddineChaouch</a>
</div>
