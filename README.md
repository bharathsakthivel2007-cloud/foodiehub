# 🍔 Foodie - Online Food Delivery System (College Mini Project)

A simple, human-coded full-stack web application developed for college mini-project / viva demonstration.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, React with JSX (via CDN - self-contained, no build tools required)
- **Backend:** Node.js, Express.js (Port 5000)
- **Database:** JSON File DB (`foods.json`, `orders.json` - simple file reading/writing, no MongoDB setup required)

---

## 🚀 How to Open and Run the Project

### Method 1: Instant Browser Opening (Zero Setup)
1. In VS Code or Windows File Explorer, simply **double-click** [frontend/index.html](file:///c:/online%20food%20delivery%20system/frontend/index.html) (or root `index.html`).
2. Or right-click `index.html` > **Open with Live Server**.
3. The app opens immediately! You can test login, browsing, food cart, UPI QR checkout, order confirmation, and admin dashboard without needing the backend running.

### Method 2: Full-Stack Mode with Express Server
1. Open terminal inside VS Code:
   ```bash
   cd backend
   node server.js
   ```
2. Open your browser and go to:
   ```text
   http://localhost:5000
   ```
3. The server serves both the frontend website and the backend REST API. Customer orders will be saved directly into `backend/orders.json`.

---

## 🔐 Credentials (Login Details)

| Role | Access Page | Credentials | Notes |
|---|---|---|---|
| **Customer** | Customer Login | Any Email & Password | Demo allows any credentials (extracts name from email prefix) |
| **Admin** | Separate Admin Portal | **Username:** `admin`<br>**Password:** `admin123` | Authorized access to orders dashboard & delivery status management |

---

## 📁 Project Structure

```text
online-food-delivery/
├── frontend/
│   ├── index.html        # Main app entry (self-contained, opens anywhere)
│   ├── style.css         # Clean custom CSS with 2-column layout and mobile support
│   └── app.jsx           # Standalone React JSX code for project review
├── backend/
│   ├── server.js         # Express server (Serves API + Frontend on Port 5000)
│   ├── foods.json        # Food items catalog
│   ├── orders.json       # Stored customer orders
│   └── package.json      # Express & CORS dependencies
└── README.md             # Project documentation and execution guide
```

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the full frontend food delivery web app |
| `GET` | `/api/foods` | Returns list of 6 food items from `foods.json` |
| `POST` | `/api/login` | Validates customer email & password |
| `POST` | `/api/admin/login` | Validates admin username (`admin`) & password (`admin123`) |
| `POST` | `/api/orders` | Generates Order ID (e.g., `ORD1234`), saves order into `orders.json` with status `Pending` |
| `GET` | `/api/orders` | Returns all completed orders (for admin / viva demo) |
| `POST` | `/api/orders/status` | Toggles order status between `Pending` and `Delivered` |
