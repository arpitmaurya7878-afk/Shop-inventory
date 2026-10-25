# Janta Auto Parts — Inventory Management

Private, local-first MERN inventory dashboard for the shop owner.

## Requirements
- Node.js 20+
- MongoDB running locally or a MongoDB connection string

## Start backend
```bash
cd backend
npm install
# Copy .env.example to .env and adjust MONGO_URI if needed
npm run dev
```
Default API: `http://localhost:8000/api`

## Start frontend (new terminal)
```bash
cd frontend
npm install
# Copy .env.example to .env if needed
npm run dev
```
Open `http://localhost:5173`.

## Features
Add, list, search by product/supplier, edit and delete products; newest-first sorting; discount-based price calculation; stock +/- buttons; confirmation modal; responsive Tailwind dashboard; toast messages.

## API
- POST/GET `/api/products`
- GET/PUT/DELETE `/api/products/:id`
- PATCH `/api/products/:id/increase-stock`
- PATCH `/api/products/:id/decrease-stock`

If discount is provided (including 0), the server calculates the final selling price. Otherwise finalSellingPrice is entered manually. This version has no login by design and should not be exposed publicly without authentication.
