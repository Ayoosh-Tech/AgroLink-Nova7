# AgroLink — Frontend

React (Vite) frontend for AgroLink, an agricultural produce marketplace connecting
farmers directly with buyers. Built by Team Nova7 (NextGen Innovators).

## Setup

```bash
cp .env.example .env      # set VITE_API_URL if your API isn't on localhost:5000
npm install
npm run dev                # http://localhost:5173
```

Run the backend alongside it — see `../backend/README.md`.

## Project structure

```
src/
  main.jsx, App.jsx           Bootstrap + routing table
  context/                     AuthContext (session), CartContext (client-side cart)
  hooks/                        useAuth, useCart — thin wrappers around the contexts
  services/                      api.js (axios client) + one file per resource
                                  (authService, productService, orderService,
                                  userService, adminService)
  utils/                          formatters.js, validators.js (Zod schemas)
  styles/                          main.css / components.css / responsive.css
  components/
    layout/                        Navbar, Footer, MainLayout, DashboardLayout, ProtectedRoute
    product/                        ProductCard, ProductFilters, ProductForm
    cart/                            CartItemRow, CartSummary
    common/                          Loader, EmptyState, Badge, Modal
  pages/                            One file per page — see below
```

## Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/about` | About | Public |
| `/login`, `/register` | Auth | Public |
| `/products`, `/products/:id` | Browse & details | Public |
| `/cart`, `/checkout` | Cart & checkout | Buyer |
| `/buyer/dashboard` | Order history | Buyer |
| `/farmer/dashboard` | Listings (CRUD) + Orders | Farmer |
| `/admin/dashboard` | Overview / Users / Listings / Orders | Admin |
| `/profile` | Edit profile + change password | Any logged-in user |
| `*` | 404 | Public |

## How auth + roles work

- `AuthContext` stores the JWT in `localStorage` and restores the session on
  reload via `GET /api/auth/me`.
- `ProtectedRoute` (in `components/layout/`) redirects to `/login` if you're
  not authenticated, and back to `/` if your role doesn't match the route's
  `roles` prop — e.g. a buyer can't open `/farmer/dashboard`.
- The Navbar reads `user.role` to point the "Dashboard" link at the right
  place and to hide the cart icon for farmers/admins (they don't buy).

## How the cart works

There's no `Cart` table in the database (per the spec — only Users, Products,
Orders, OrderItems). The cart is purely client-side state (`CartContext`,
persisted to `localStorage` under `agrolink.cart`) until the buyer checks out,
at which point `Checkout.jsx` sends `{ items: [{productId, quantity}], ... }`
to `POST /api/orders`, which is where an actual `Order` + `OrderItems` get
created in the database. The backend re-validates price and stock for every
item at that point — the cart's prices are never trusted directly.

## Deployment (Netlify)

1. Push this folder to GitHub.
2. In Netlify: **New site from Git**, pick the repo, set the base directory to
   `frontend` if it's in a monorepo.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Add environment variable `VITE_API_URL` pointing at your deployed Render
   backend, e.g. `https://agrolink-api.onrender.com/api`.
5. Add a `_redirects` file (or Netlify's SPA redirect setting) so client-side
   routes like `/products/123` don't 404 on refresh:
   ```
   /*  /index.html  200
   ```
