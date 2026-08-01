# AgroLink API

Backend for **AgroLink** — an agricultural produce marketplace connecting farmers
directly with buyers. Node.js + Express + PostgreSQL (via Sequelize) + JWT auth.

## Setup

```bash
cp .env.example .env      # fill in DATABASE_URL (Supabase/Neon) and JWT_SECRET
npm install
npm run db:sync            # creates the users/products/orders/order_items tables
npm run db:seed             # optional — sample admin, farmer, buyer, and products
npm run dev                  # starts the API on http://localhost:5000
```

Seeded demo accounts (after `npm run db:seed`):

| Role | Email | Password |
|---|---|---|
| Admin | *****@agrolink.com | ******** |
| Farmer | *****@agrolink.com | ******** |
| Buyer | *****@agrolink.com | ******** |

## Project structure

```
config/db.js          Sequelize connection to PostgreSQL
models/                User, Product, Order, OrderItem + associations (index.js)
middleware/
  authMiddleware.js     JWT verification (protect)
  roleMiddleware.js     Role-based access (allowRoles)
  validateMiddleware.js  express-validator error handler
  errorMiddleware.js      Centralized error + 404 handler
controllers/            One file per resource — request handling + business logic
routes/                  Route definitions + validation rules
utils/
  generateToken.js        JWT signing
  apiResponse.js           Shared response helpers
  syncDb.js                 Creates/updates tables from the models
  seed.js                    Sample data for local development
server.js                Entry point
```

## Data model

- **Users** — farmer / buyer / admin, distinguished by `role`. Passwords are
  bcrypt-hashed automatically via a Sequelize hook — controllers never hash
  manually.
- **Products** — owned by a farmer (`farmerId`), with `category` (Vegetables,
  Grains, Fruits, Livestock, Tubers), `price`, `quantity` (stock), and `location`
  for the location filter.
- **Orders** — placed by a buyer, with a `status` (pending → accepted →
  delivered, or cancelled) and a snapshot delivery address.
- **OrderItems** — line items on an order. Each stores a **snapshot** of the
  product name and price at purchase time (`productName`, `unitPrice`), so
  order history stays accurate even if a product is later edited or deleted.
  Each item also stores `farmerId` directly, so a farmer can query "orders
  containing my products" without joining through Product every time — this is
  what powers the Farmer Dashboard's order list, since one order can contain
  products from multiple farmers.

## Checkout flow

`POST /api/orders` is the only place an Order gets created. It:
1. Re-reads each product's price and stock from the database inside a
   transaction (never trusts prices sent from the frontend cart).
2. Rejects the whole order if any item is out of stock.
3. Decrements stock and creates the Order + OrderItems atomically — if
   anything fails, the whole transaction rolls back.

## API overview

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | – | Create a farmer or buyer account |
| POST | /api/auth/login | – | Log in |
| GET | /api/auth/me | user | Current user |
| GET | /api/products | – | Browse/search/filter listings |
| GET | /api/products/:id | – | Product details |
| GET | /api/products/mine/list | farmer | My own listings |
| POST | /api/products | farmer | Create a listing |
| PATCH | /api/products/:id | farmer | Edit my listing |
| DELETE | /api/products/:id | farmer | Delete my listing |
| POST | /api/orders | buyer | Checkout (create an order) |
| GET | /api/orders/mine | buyer | My order history |
| GET | /api/orders/farmer | farmer | Orders containing my products |
| PATCH | /api/orders/:id/status | farmer/admin | Update order status |
| GET/PATCH | /api/users/me | user | View/edit profile |
| PATCH | /api/users/me/password | user | Change password |
| GET | /api/admin/dashboard | admin | Stats: users, listings, orders, revenue |
| GET/PATCH/DELETE | /api/admin/users | admin | Manage users |
| GET/DELETE | /api/admin/products | admin | Moderate listings |
| GET | /api/admin/orders | admin | View all orders |

## Deployment (Render)

1. Push this folder to GitHub.
2. Create a new **Web Service** on Render, point it at the repo/subfolder.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the same environment variables from `.env.example` in Render's dashboard
   (use your real Supabase/Neon `DATABASE_URL`, set `CLIENT_URL` to your Netlify
   frontend URL once deployed).
5. After the first deploy, run `npm run db:sync` once (Render's Shell tab, or
   locally against the production `DATABASE_URL`) to create the tables.
