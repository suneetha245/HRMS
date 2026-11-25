# HR Management System (MERN)

React (Vite) + Node/Express + MongoDB. HR/Admin login, employee CRUD, search, Excel export.

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## 1. Backend
```bash
cd server
npm install
cp .env.example .env      # edit JWT_SECRET, MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed              # creates the HR/Admin account (password stored as a bcrypt hash)
npm run dev               # http://localhost:5000
```

## 2. Frontend
```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

## 3. Use it
Open http://localhost:5173 -> Admin Login -> sign in with ADMIN_EMAIL / ADMIN_PASSWORD
(defaults in .env.example: `admin@hrms.com` / `Admin@123` - change these).

## API (all /api/employees routes require `Authorization: Bearer <token>`)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/login | Admin login, returns JWT |
| GET | /api/employees | List all |
| GET | /api/employees/:id | Get one |
| POST | /api/employees | Add (ID auto-generated, duplicate email blocked) |
| PUT | /api/employees/:id | Update |
| DELETE | /api/employees/:id | Delete |
| GET | /api/employees/export | Download Employee_List.xlsx |
