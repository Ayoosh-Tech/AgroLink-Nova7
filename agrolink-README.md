# AgroLink

An agricultural produce marketplace connecting farmers directly with buyers —
built by **Team Nova7 (NextGen Innovators)** as a capstone project.

```
agrolink/
├── frontend/   React (Vite) — deploys to Netlify
└── backend/    Node.js/Express + PostgreSQL (Sequelize) — deploys to Render
```

## Quick start (local development)

```bash
# 1. Backend
cd backend
cp .env.example .env      # add your DATABASE_URL (Supabase/Neon) + JWT_SECRET
npm install
npm run db:sync
npm run db:seed            # optional demo data
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

See `backend/README.md` and `frontend/README.md` for full details, the API
reference, the data model, and deployment steps.

## Tech stack

- **Frontend:** React, React Router, Axios, React Hook Form + Zod, Vite
- **Backend:** Node.js, Express, Sequelize
- **Database:** PostgreSQL (Supabase or Neon)
- **Auth:** JWT + bcrypt
- **Deployment:** Netlify (frontend) · Render (backend) · Supabase/Neon (database)

## Roles

- **Farmer** — register, log in, create/edit/delete listings, view orders for their products, manage profile
- **Buyer** — register, log in, browse/search products, add to cart, checkout, view order history, manage profile
- **Admin** — manage users, listings, and orders; view dashboard statistics

## Demo accounts (after `npm run db:seed`)

| Role | Email | Password |
|---|---|---|
| Admin | *****@agrolink.com | ******** |
| Farmer | *****@agrolink.com | ******** |
| Buyer | *****@agrolink.com | ******** |
