# 🏠 Balaji Enterprises — Home Appliances Web Application

## ⚡ Quick Start (Run Locally)

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- Git

---

## Step 1 — Set Up the Database

1. Open **MySQL Workbench** or **phpMyAdmin**
2. Create a new database:
   ```sql
   CREATE DATABASE home_appliances_db;
   ```
3. Import your existing database dump (if you have one):
   ```bash
   mysql -u root -p home_appliances_db < database_backup.sql
   ```

---

## Step 2 — Configure the Backend

1. Go into the backend folder:
   ```bash
   cd BACKEND
   ```

2. **Edit `.env`** with your MySQL password:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
   DB_NAME=home_appliances_db
   PORT=5000
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Start the backend:
   ```bash
   npm run dev     # with auto-reload (nodemon)
   # OR
   npm start       # without auto-reload
   ```

   ✅ You should see:
   ```
   🚀 Server running on http://localhost:5000
   ✅ MySQL connected to database: home_appliances_db
   ```

---

## Step 3 — Run the Frontend

Open a **new terminal** in the project root:

```bash
npm install
npm run dev
```

Open browser: **http://localhost:5173**

---

## 🔑 Default Credentials

### Admin Panel
- URL: `http://localhost:5173/Adminpenal`
- Check your `admin` table for credentials

### User Login
- Register at: `http://localhost:5173/userregister`
- Then login at: `http://localhost:5173/cuslogin`

---

## 📁 Project Structure

```
project/
├── BACKEND/              ← Node.js + Express backend
│   ├── server.js         ← Main server (all API routes)
│   ├── productRoutes.js  ← Product detail routes
│   ├── payment.js        ← Razorpay payment routes
│   ├── sendEmail.js      ← Order email notifications
│   ├── .env              ← ⚠️ Your config (DB password etc)
│   └── uploads/          ← Product images stored here
│
├── src/                  ← React frontend
│   ├── FRONTEND/
│   │   ├── USER/         ← Customer-facing pages
│   │   ├── ADMIN/        ← Admin dashboard
│   │   └── SERVICEPROVIDER/ ← Service provider panel
│   ├── theme.css         ← Global design system
│   └── config.js         ← API base URL config
│
└── dist/                 ← Built frontend (after npm run build)
```

---

## 🛠️ Troubleshooting

### Products not showing
- Make sure the backend is running on port 5000
- Check your MySQL database has products in `product_details` table
- Verify subcategory names match exactly: "LED", "QLED", "Top Load", "Front Load", "Split AC", "Window AC", "Single Door", "Double Door", "Tripple Door", "Side-by-side Door", "RO Water Purifier"

### Cannot login
- Check MySQL is running
- Verify DB_PASSWORD in `BACKEND/.env` matches your MySQL root password
- Ensure the `user` table exists in your database

### Images not showing
- Product images are served from `BACKEND/uploads/`
- The backend must be running for images to load

### Change server URL (for deployment)
- Edit `BACKEND/.env` — change DB settings
- Edit `src/config.js` — change `BASE_URL` or set `VITE_API_URL` env variable

---

## 🚀 Production Deployment

```bash
# Build frontend
npm run build

# The BACKEND/server.js already serves the dist/ folder
# Just run the backend on your server:
cd BACKEND && node server.js
```

