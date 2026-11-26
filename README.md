# HR Management System (MERN)

React (Vite) + Node/Express + MongoDB. HR/Admin login, employee CRUD, search, Excel export.

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string.

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET`
- `MONGO_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Then run:

```bash
npm run seed
npm run dev
```

Backend runs at: `http://localhost:5007`

## 2. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5007/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 3. How to Use

1. Open `http://localhost:5173`.
2. Go to Admin Login.
3. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in the backend `.env` file.

Default credentials in `.env.example`:
- Email: `admin@hrms.com`
- Password: `Admin@123`

**Important:** Change the default credentials before using the application.

## 4. API Endpoints

All `/api/employees` routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Admin login, returns JWT |
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/:id` | Get one employee |
| POST | `/api/employees` | Add employee (ID auto-generated, duplicate email blocked) |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/export` | Download Employee_List.xlsx |