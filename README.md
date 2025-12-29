
# VinnoDrive ☁️

**VinnoDrive** is a smart, content-aware cloud storage solution designed to optimize storage efficiency. It uses **SHA-256 hashing** to detect duplicate files across the entire system, ensuring that identical content is physically stored only once—saving massive amounts of disk space while maintaining user data privacy.

## 🚀 Key Features

* **Smart Deduplication:** Files are hashed on the client-side. If a file already exists in the cloud (uploaded by any user), we store a reference instead of a new physical copy.
* **Virtual Folder System:** Create and navigate nested folders without complex database structures.
* **Storage Quotas:** Enforced 10MB physical limit per user (deduplicated files don't count against this quota!).
* **Modern UI:** Built with React, TypeScript, and Tailwind CSS. Features a responsive design with a polished **Dark Mode**.
* **Secure Auth:** Robust JWT (JSON Web Token) authentication flow with automatic token refreshing.
* **Drag & Drop:** Intuitive file upload interface supporting multiple files.

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite)
* **TypeScript**
* **Tailwind CSS** (Styling & Dark Mode)
* **Axios** (API Requests)
* **Lucide React** (Icons)

### Backend
* **Python 3.10+**
* **Django 5** & **Django REST Framework (DRF)**
* **PostgreSQL** (Production DB) / SQLite (Dev)
* **SimpleJWT** (Authentication)

---

## ⚡️ Getting Started

Follow these steps to set up the project locally.

### 1. Backend Setup (Django)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
# (Ensure django, djangorestframework, djangorestframework-simplejwt, psycopg2-binary, django-cors-headers are installed)

# 4. Setup Environment Variables
# Create a .env file in backend/ directory
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DEBUG=True" >> .env

# 5. Run Migrations
python manage.py makemigrations
python manage.py migrate

# 6. Start Server
python manage.py runserver

```

*The API will be available at `http://127.0.0.1:8000/api/*`

### 2. Frontend Setup (React)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start Development Server
npm run dev

```

*The app will be available at `http://localhost:5173*`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/api/auth/register/` | Create a new account | No |
| **POST** | `/api/auth/login/` | Get Access & Refresh Tokens | No |
| **POST** | `/api/auth/refresh/` | Refresh expired Access Token | No |
| **GET** | `/api/auth/user/` | Get current user profile | Yes |
| **GET** | `/api/files/` | List all user files | Yes |
| **POST** | `/api/upload/` | Upload file (Multipart Form) | Yes |

---

## 📂 Project Structure

```text
vinnodrive/
├── backend/
│   ├── core/             # Django settings & config
│   ├── drive/            # Main app logic (Models, Views, Serializers)
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/          # API utility functions (user.ts, logout.ts)
│   │   ├── components/   # React components (Dashboard, Navbar, etc.)
│   │   ├── hooks/        # Custom hooks (useTheme)
│   │   └── App.tsx       # Main Entry
│   └── package.json
└── README.md

```

## 🧠 How Deduplication Works

1. **Hashing:** When a user selects a file, the browser calculates its **SHA-256 hash**.
2. **Upload:** This hash + the file binary are sent to Django.
3. **Check:** Django checks the `PhysicalBlob` table.
* **Match Found:** It increments the reference count and links the new user file to the *existing* blob. **(0 bytes used on disk)**
* **No Match:** It saves the file to disk/cloud and creates a new `PhysicalBlob`.


4. **Result:** The user sees the file in their dashboard instantly, and the system saves storage.

