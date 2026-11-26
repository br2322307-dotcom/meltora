# 🍫 MeltOra — Taste the Purity (Fullstack Brand & Admin Platform)

MeltOra is a fullstack confectionery & dairy brand platform (**Artisanal Chocolates & Pure Desi Ghee**) built with **React 19 + Vite** on the frontend and **Flask (Python) + MongoDB Atlas** on the backend.

> **সংক্ষেপে (Overview in Bengali):**  
> এটি MeltOra ব্র্যান্ডের সম্পূর্ণ ওয়েবসাইট এবং অ্যাডমিন ড্যাশবোর্ড। কাস্টমাররা কোনো লগইন ছাড়াই **Home (`/`)** থেকে প্রোডাক্ট এক্সপ্লোর করে সরাসরি **WhatsApp** (Chocolate ও Desi Ghee-এর আলাদা নম্বর অথবা কম্বাইন্ড গ্রুপ) বা **Direct Call**-এ যোগাযোগ করতে পারবেন, আর মালিক **`/meltora-br-admin`** থেকে পাসওয়ার্ড দিয়ে লগইন করে প্রোডাক্ট, ব্যানার, WhatsApp নম্বর ও অর্ডার ম্যানেজ করতে পারবেন।

---

## 📁 Complete Project Structure

```text
MeltOra/
├── api/
│   └── index.py                      # Vercel Python Serverless WSGI entry point (exports Flask app)
├── backend/
│   ├── app.py                        # Flask REST API, Admin Auth (HMAC Token) & Static Serving
│   ├── db.py                         # MongoDB Atlas / PyMongo connection, indexes & seeding
│   ├── migrate_sqlite_to_mongo.py    # One-time migration helper from legacy meltora.db to MongoDB
│   ├── requirements.txt              # Python dependencies (Flask, pymongo, dnspython, python-dotenv)
│   ├── .env.example                  # Environment variable template (MONGO_URI, MONGO_DB_NAME)
│   └── .env                          # Active MongoDB credentials (keep private)
│
├── my-react-app/
│   ├── index.html                    # Root HTML with Google Fonts (English + Bengali)
│   ├── package.json                  # React 19, Vite 8, ESLint & qrcode package
│   ├── vite.config.js                # Dev server proxy (/api -> http://127.0.0.1:5000)
│   └── src/
│       ├── main.jsx                  # React entry point
│       ├── App.jsx                   # Adapter/Shell: routes pages/ & gates /meltora-br-admin
│       ├── flux/
│       │   └── meltoraFlux.js        # Central Reducer, Admin Auth & Resilient API Actions
│       ├── pages/                    # Modular Page Views (assembled inside App.jsx)
│       │   ├── HomePage.jsx          # Brand Hero Banner, Categories, Collections & QR Banner
│       │   ├── ExplorePage.jsx       # Search & Category Filter (All / Chocolate / Desi Ghee)
│       │   ├── ProductDetailPage.jsx # Full Details, 1-Click WhatsApp, Call & Related Items
│       │   ├── ScanPage.jsx          # Official Website QR Code (/), plus Admin Pack QR Hub
│       │   └── AdminLoginPage.jsx    # Protected Login Gate for /meltora-br-admin
│       ├── components/               # Reusable UI Building Blocks
│       │   ├── Header.jsx            # Top Navbar + Admin Top Strip with Logout
│       │   ├── Footer.jsx            # Brand Footer & Direct Contact Links
│       │   ├── SideDrawer.jsx        # Navigation Drawer (Customer vs Admin menus)
│       │   ├── ProductArtwork.jsx    # Vector SVG & Custom Image Renderers
│       │   ├── ProductCard.jsx       # Reusable Product Card
│       │   ├── QRCodeBox.jsx         # Real Scannable QR Generator & PNG Downloader
│       │   ├── QuickOrderSheet.jsx   # Direct WhatsApp Desk Selector (Choco / Ghee / Group)
│       │   ├── OrdersModal.jsx       # Admin Saved Orders Viewer with Delete & Delete All
│       │   └── StudioModal.jsx       # Admin Customizer (Products, WhatsApp, Hero Banner)
│       ├── utils/
│       │   ├── qr.js                 # Route detection (/ vs /meltora-br-admin) & QR URLs
│       │   └── whatsapp.js           # Category-based WhatsApp & Group URL builders
│       └── style/
│           └── meltora.css           # Complete Luxury Brand Stylesheet
│
├── requirements.txt                  # Root Python dependencies for Vercel Python Runtime
├── vercel.json                       # Vercel build, outputDirectory & SPA/API rewrites
├── .gitignore                        # Excludes .env, node_modules, dist, meltora.db
├── .vercelignore                     # Excludes local-only files from Vercel upload
├── start_dev.bat                     # Development launcher (Flask :5000 + Vite :5173)
├── start_prod.bat                    # Production build & launcher (Flask serves dist/ on :5000)
└── README.md                         # Project documentation
```

---

## 🧠 How Every Layer Works (Code & Architecture Explained)

### 1. Adapter Architecture & Route Separation (`src/App.jsx` + `src/utils/qr.js`)

**How it works:**  
`App.jsx` acts as a clean page adapter rather than holding monolithic UI logic. On load, `isAdminPath()` inspects `window.location.pathname` to determine whether the visitor is on the public customer storefront (`/`) or the private admin portal (`/meltora-br-admin`). When on `/meltora-br-admin` without an active verified token, `App.jsx` renders `AdminLoginPage` and keeps all admin modals (`StudioModal`, `OrdersModal`) unmounted. Once authenticated, `ActivePage` switches cleanly among `HomePage`, `ExplorePage`, `ProductDetailPage`, and `ScanPage` inside `src/pages/`.

```jsx
// my-react-app/src/App.jsx
function ActivePage({ state, actions }) {
  switch (state.currentPage) {
    case "explore":
      return <ExplorePage state={state} actions={actions} />;
    case "product":
      return <ProductDetailPage state={state} actions={actions} />;
    case "scan":
      return <ScanPage state={state} actions={actions} />;
    case "home":
    default:
      return <HomePage state={state} actions={actions} />;
  }
}

export default function App() {
  const { state, actions } = useMeltoraFlux();
  const showAdminGate = state.isAdmin && !state.adminAuthenticated;

  return showAdminGate ? (
    <main className="app-container">
      <AdminLoginPage state={state} actions={actions} />
    </main>
  ) : (
    <main className="app-container">
      <Header state={state} actions={actions} />
      <ActivePage state={state} actions={actions} />
      <Footer state={state} actions={actions} />
    </main>
  );
}
```

> **সহজ কথায়:** কাস্টমার রুট `/` সবসময় কোনো লগইন ও এডিট অপশন ছাড়াই চলবে। শুধুমাত্র `/meltora-br-admin` রুটটি অ্যাডমিন লগইন ও কাস্টমাইজেশনের জন্য সংরক্ষিত।

---

### 2. Zero-Login Marketing Flow & WhatsApp Routing (`src/utils/whatsapp.js` + `src/flux/meltoraFlux.js`)

**How it works:**  
Customers never face a signup or checkout wall. Clicking any product opens `ProductDetailPage.jsx`, displaying details, pack size, price, a Direct Call link (`tel:`), and cross-category recommendations (so someone scanning a Desi Ghee jar also discovers MeltOra Chocolates). Clicking **"Order / Chat on WhatsApp"** runs `getWhatsAppRedirectUrl()`, which routes to `chocolateWhatsappNumber` for chocolates, `gheeWhatsappNumber` for desi ghee, or `whatsappGroupLink` when `whatsappRoutingMode` is set to `"group"`, while asynchronously logging the inquiry in MongoDB via `POST /api/orders`.

```js
// my-react-app/src/utils/whatsapp.js
export function getWhatsAppRedirectUrl({
  category = "chocolate",
  routingMode = "category",
  chocolateWhatsappNumber,
  gheeWhatsappNumber,
  whatsappGroupLink,
  message = "",
  forceMode = null,
}) {
  const mode = forceMode || routingMode || "category";
  if (mode === "group" && whatsappGroupLink) {
    return whatsappGroupLink;
  }

  const rawNumber = category === "ghee" ? gheeWhatsappNumber : chocolateWhatsappNumber;
  const digits = sanitizePhoneDigits(rawNumber);
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : whatsappGroupLink || "https://wa.me/";
}
```

---

### 3. Official Brand QR Code & Product Scan Landing (`src/pages/ScanPage.jsx` + `src/components/QRCodeBox.jsx`)

**How it works:**  
`ScanPage.jsx` displays the official MeltOra Website QR Code pointing to the customer root (`/`). Any customer scanning the QR with a mobile camera lands directly on the MeltOra Home Page. Inside `/meltora-br-admin`, the owner also gets an optional **Product-Specific Pack QR Generator** (`/?scan=<productId>`) to print downloadable PNG QR stickers that open `ProductDetailPage.jsx` with a `Verified MeltOra Product Scanned` badge.

```js
// my-react-app/src/utils/qr.js
export function getHomeWebsiteUrl() {
  if (typeof window === "undefined") return "/";
  return `${window.location.origin}/`;
}

export function getProductScanUrl(productId) {
  if (typeof window === "undefined") return `/?scan=${encodeURIComponent(productId)}`;
  const url = new URL(window.location.origin + "/");
  url.searchParams.set("scan", productId);
  return url.toString();
}
```

---

### 4. MongoDB Cloud Data Layer (`backend/db.py`)

**How it works:**  
All persistent data resides in **MongoDB** (no local disk database required at runtime). `backend/db.py` loads `MONGODB_URI` (or `MONGO_URI`) and `MONGO_DB_NAME` from `backend/.env` using `python-dotenv`, connects via `pymongo.MongoClient`, ensures unique indexes on `products.id`, `orders.id`, and `settings.key`, seeds the initial Chocolate/Ghee catalog when empty, and provides atomic `MLT-100x` order numbering through the `counters` collection.

```python
# backend/db.py
def init_db():
    """Creates indexes and seeds default settings & products in MongoDB if empty."""
    db = get_db()
    db.products.create_index("id", unique=True)
    db.orders.create_index("id", unique=True)
    db.settings.create_index("key", unique=True)

    for key, value in DEFAULT_SETTINGS.items():
        db.settings.update_one(
            {"key": key},
            {"$setOnInsert": {"key": key, "value": value}},
            upsert=True,
        )

    if db.products.count_documents({}) == 0:
        for idx, prod in enumerate(DEFAULT_PRODUCTS):
            db.products.update_one(
                {"id": prod["id"]},
                {"$setOnInsert": {**prod, "sort_order": idx}},
                upsert=True,
            )
```

---

### 5. Flask API Security & Static SPA Serving (`backend/app.py`)

**How it works:**  
`backend/app.py` separates public customer routes from admin-protected management routes. Admin login (`POST /api/admin/login`) verifies credentials using `hashlib.sha256` + `hmac.compare_digest` and issues a 24-hour HMAC-signed Bearer token. Every admin mutation and order management route is protected by `@require_admin`. For production hosting, `serve_frontend()` serves the compiled Vite bundle (`my-react-app/dist/`) for both `/` and `/meltora-br-admin`.

```python
# backend/app.py
def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == "OPTIONS":
            return jsonify({"status": "ok"})
        user = verify_admin_token(get_bearer_token())
        if not user:
            return jsonify({"success": False, "error": "Unauthorized admin access"}), 401
        return fn(*args, **kwargs)
    return wrapper
```

---

## 🔗 REST API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Checks live MongoDB Atlas connectivity (`200` or `503`) |
| `GET` | `/api/home-data` | Public | Fetches chocolates, desi ghees, hero slides & WhatsApp config |
| `POST` | `/api/orders` | Public | Logs WhatsApp tap/order in MongoDB and returns routed `whatsappUrl` |
| `POST` | `/api/admin/login` | Public | Authenticates admin User ID & Password, returns Bearer token |
| `GET` | `/api/admin/verify` | Admin | Validates active Bearer session token |
| `POST` | `/api/products` | Admin | Adds a new Chocolate or Desi Ghee product to MongoDB |
| `DELETE` | `/api/products/<id>` | Admin | Deletes a product from MongoDB |
| `POST` | `/api/hero-slides` | Admin | Saves hero banner slides and transition animation (`slide`/`fade`/`zoom`) |
| `POST` | `/api/settings` | Admin | Saves Chocolate/Ghee WhatsApp numbers, Group link & Call number |
| `GET` | `/api/orders` | Admin | Lists all saved customer inquiries/orders from MongoDB |
| `DELETE` | `/api/orders/<id>` | Admin | Deletes a single saved order by ID |
| `DELETE` | `/api/orders` | Admin | Clears all saved orders from MongoDB (`Delete All`) |
| `GET` | `/`, `/meltora-br-admin` | Public | Serves the React production build (`my-react-app/dist/`) |

---

## ⚙️ Environment Setup (`backend/.env`)

Create `backend/.env` using `backend/.env.example` as your template:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
MONGO_DB_NAME="meltora"
```

Optional admin credential overrides (environment variables):
```env
MELTORA_ADMIN_USER="your_admin_id"
MELTORA_ADMIN_PASS="your_admin_password"
MELTORA_ADMIN_SECRET="your_random_signing_secret"
```

> **বাংলা গাইড:** `backend/.env` ফাইলের ভেতরে আপনার MongoDB Atlas কানেকশন লিংক (`MONGODB_URI`) বসান। পাসওয়ার্ড বা `.env` ফাইল কখনো পাবলিক GitHub-এ আপলোড করবেন না।

---

## 🚀 কমান্ড গাইড (How to Install, Build & Run)

### Option 1: এক ক্লিকে চালানো (One-Click Batch Files)
* **Development Mode** (নতুন কোড এডিট ও লাইভ রিলোডের জন্য): **`start_dev.bat`** ফাইলে ডাবল ক্লিক করুন।
* **Production Mode** (পুরো অ্যাপ বিল্ড করে পোর্ট `5000`-এ একসাথে চালানোর জন্য): **`start_prod.bat`** ফাইলে ডাবল ক্লিক করুন।

---

### Option 2: টার্মিনাল কমান্ড (Manual PowerShell Commands)

**১. Python ব্যাকএন্ড প্যাকেজ ইনস্টল করা (প্রথমবার):**
```powershell
pip install -r backend/requirements.txt
```

**২. React ফ্রন্টএন্ড প্যাকেজ ইনস্টল ও প্রোডাকশন বিল্ড করা:**
```powershell
npm --prefix my-react-app install
npm --prefix my-react-app run build
```

**৩. কোড কোয়ালিটি (Lint) চেক করা:**
```powershell
npm --prefix my-react-app run lint
```

**৪. (ঐচ্ছিক) পুরনো লোকাল SQLite (`meltora.db`) ডেটা MongoDB-তে পাঠানো:**
```powershell
python backend/migrate_sqlite_to_mongo.py
```

**৫. Flask সার্ভার চালু করা (Production Static + API):**
```powershell
python backend/app.py
```

**৬. Development মোডে আলাদা করে Vite Frontend চালু করা (আরেকটি টার্মিনালে):**
```powershell
npm --prefix my-react-app run dev
```

---

## ☁️ Vercel Deployment Guide

1. **MongoDB Atlas Network Access:** In MongoDB Atlas → **Network Access**, add `0.0.0.0/0` so Vercel serverless functions can connect.
2. **Vercel Environment Variables:** In your Vercel Project → **Settings → Environment Variables**, add:
   - `MONGODB_URI` = your MongoDB Atlas SRV string
   - `MONGO_DB_NAME` = `meltora`
   - `MELTORA_ADMIN_USER` / `MELTORA_ADMIN_PASS` / `MELTORA_ADMIN_SECRET` (optional overrides)
3. **Deploy Command (or connect GitHub repo directly):**
   ```powershell
   vercel --prod
   ```

> **বাংলা টিপস:** Vercel-এ রুট `requirements.txt`, `vercel.json`, এবং `api/index.py` আগে থেকেই সেট করা আছে। শুধু Vercel ড্যাশবোর্ডে `MONGODB_URI` এবং MongoDB Atlas-এ `0.0.0.0/0` অ্যাক্সেস দিয়ে দিলেই ডিপ্লয় হয়ে যাবে।

---

## 🌐 Live URLs

* **Customer Storefront (কোনো লগইন ছাড়া):** `http://127.0.0.1:5000/` (Dev: `http://localhost:5173/`)
* **MeltOra - Admin Dashboard (লগইন সুরক্ষিত):** `http://127.0.0.1:5000/meltora-br-admin` (Dev: `http://localhost:5173/meltora-br-admin`)
* **MongoDB Health Check:** `http://127.0.0.1:5000/api/health`
