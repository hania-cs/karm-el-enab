# 🌱 Farm Management System - Local Setup Guide

> **Complete step-by-step instructions for running this project on your local computer**

---

## 📋 Table of Contents

1. [Prerequisites Checklist](#-prerequisites-checklist)
2. [Option A: Quick Setup (Connect to Cloud)](#-option-a-quick-setup-connect-to-cloud-database)
3. [Option B: Full Local Setup (Offline)](#-option-b-full-local-setup-offline-capable)
4. [Importing CSV Data](#-importing-csv-data)
5. [Creating Test Accounts](#-creating-test-accounts)
6. [Troubleshooting](#-troubleshooting)
7. [Common Commands Reference](#-common-commands-reference)

---

## ✅ Prerequisites Checklist

Before starting, install these tools on your computer:

### Required for All Setups

| Tool | Version | Download Link | How to Verify |
|------|---------|---------------|---------------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | `git --version` |
| **VS Code** (recommended) | Latest | [code.visualstudio.com](https://code.visualstudio.com/) | Open the app |

### Additional for Full Local Setup (Option B)

| Tool | Version | Download Link | How to Verify |
|------|---------|---------------|---------------|
| **Docker Desktop** | Latest | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) | `docker --version` |
| **Supabase CLI** | Latest | See instructions below | `supabase --version` |

---

## 🚀 Option A: Quick Setup (Connect to Cloud Database)

**Best for:** Quick demonstration, when you have internet access

### Step 1: Get the Project Files

**Method 1: Download from GitHub**
1. Go to the GitHub repository
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract the ZIP file to a folder on your computer

**Method 2: Clone with Git**
```bash
# Open Terminal (Mac) or Command Prompt (Windows)
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd farm-management-system
```

### Step 2: Install Dependencies

```bash
# Navigate to the project folder
cd farm-management-system

# Install all required packages
npm install
```

**Expected output:** You'll see a progress bar and eventually "added XXX packages"

### Step 3: Create Environment File

1. In the project root folder, create a new file named `.env`
2. Add the following content:

```env
VITE_SUPABASE_URL=https://pigahtrccasvgkrwihhm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZ2FodHJjY2FzdmdrcndpaGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTcwMDQsImV4cCI6MjA4MDY5MzAwNH0.xjX3yeehGLbsNfBkEEKbbjgRp0CRgD2873tTuV8-Er4
VITE_SUPABASE_PROJECT_ID=pigahtrccasvgkrwihhm
```

> ⚠️ **Note:** These are the cloud database credentials. The project will connect to the live database.

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Step 5: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, or Safari)
2. Navigate to: **http://localhost:5173**
3. You should see the Farm Management System homepage!

---

## 🖥️ Option B: Full Local Setup (Offline-Capable)

**Best for:** Complete local development, offline demonstrations, database modifications

### Step 1: Complete Steps 1-2 from Option A

(Get project files and install dependencies)

### Step 2: Install Supabase CLI

**On macOS:**
```bash
brew install supabase/tap/supabase
```

**On Windows:**
```bash
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**On Linux:**
```bash
brew install supabase/tap/supabase
```

**Verify installation:**
```bash
supabase --version
```

### Step 3: Start Docker Desktop

1. Open **Docker Desktop** application
2. Wait until you see "Docker Desktop is running" (green icon in system tray)
3. Verify in terminal:
```bash
docker --version
```

### Step 4: Initialize Local Supabase

```bash
# Navigate to project folder
cd farm-management-system

# Start local Supabase services
supabase start
```

**Expected output (after a few minutes):**
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> 📝 **Save these values!** You'll need the API URL and anon key for the next step.

### Step 5: Run Database Migrations

```bash
# Apply the database schema
supabase db reset
```

This command will:
- Create all database tables (profiles, equipment, plots, rentals, booklets, etc.)
- Apply Row-Level Security policies
- Set up database functions and triggers

### Step 6: Configure Local Environment

1. Create or update the `.env` file:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<YOUR_ANON_KEY_FROM_STEP_4>
VITE_SUPABASE_PROJECT_ID=local
```

### Step 7: Start the Development Server

```bash
npm run dev
```

### Step 8: Access Local Supabase Studio

Open **http://127.0.0.1:54323** in your browser to:
- View and edit database tables
- Import CSV data
- Manage users
- Test queries

---

## 📊 Importing CSV Data

### Export Data First (If Needed)

If you need to export data from the cloud database:
1. Go to the Supabase Dashboard
2. Navigate to **Table Editor**
3. Select each table and click **Export to CSV**

### Import Order (Important!)

Import tables in this specific order to maintain data relationships:

1. **profiles** (users must exist first)
2. **user_roles** (depends on profiles)
3. **equipment** (no dependencies)
4. **booklets** (no dependencies)
5. **plots** (depends on profiles)
6. **rentals** (depends on profiles and equipment)

### Import via Supabase Studio (Recommended)

1. Open Supabase Studio:
   - **Cloud:** Go to your Supabase Dashboard → Table Editor
   - **Local:** Open http://127.0.0.1:54323

2. For each table:
   - Click on the table name
   - Click **Insert** → **Import data from CSV**
   - Select your CSV file
   - Map columns if needed
   - Click **Import**

### Import via SQL (Alternative)

```sql
-- Example: Import equipment from CSV
COPY equipment(id, name, description, quantity_available, daily_rate, image_url)
FROM '/path/to/equipment.csv'
DELIMITER ','
CSV HEADER;
```

---

## 👤 Creating Test Accounts

### Method 1: Through the Application

1. Start the application (`npm run dev`)
2. Navigate to http://localhost:5173/register
3. Fill out the registration form:
   - **Name:** Test Farmer
   - **Email:** farmer@test.com
   - **Password:** TestPassword123!
   - **Farm Name:** Test Farm
4. Click **Register**

> ⚠️ **Note:** New accounts require admin approval. See below for admin creation.

### Method 2: Through Supabase Studio

1. Open Supabase Studio
2. Go to **Authentication** → **Users**
3. Click **Add User** → **Create New User**
4. Enter email and password
5. Click **Create User**

### Creating an Admin Account

**Step 1:** Create a regular user (Method 1 or 2 above)

**Step 2:** In Supabase Studio, go to **Table Editor** → **user_roles**

**Step 3:** Insert a new row:
```json
{
  "user_id": "<USER_ID_FROM_AUTH_USERS>",
  "role": "admin"
}
```

**Step 4:** In **profiles** table, set `is_approved` to `true` for this user

### Test Account Credentials

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Admin | admin@farm.com | AdminPass123! | Full system access |
| Farmer | farmer@test.com | FarmerPass123! | Standard user access |

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "npm: command not found"

**Cause:** Node.js is not installed or not in PATH

**Solution:**
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt
- Verify: `node --version`

#### 2. "EACCES permission denied" (macOS/Linux)

**Cause:** npm doesn't have permission to install packages globally

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### 3. "supabase start" fails with Docker error

**Cause:** Docker Desktop is not running

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start (green status)
3. Run `docker ps` to verify
4. Try `supabase start` again

#### 4. "Port 5173 is already in use"

**Cause:** Another application is using the port

**Solution:**
```bash
# Find and kill the process (macOS/Linux)
lsof -i :5173
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

#### 5. "Failed to connect to database"

**Cause:** Incorrect .env configuration

**Solution:**
1. Verify your `.env` file exists in the project root
2. Check that the URLs match your setup (cloud vs local)
3. Ensure Supabase is running (local) or accessible (cloud)

#### 6. "RLS policy violation" errors

**Cause:** Row-Level Security is blocking the operation

**Solution:**
- Ensure the user is properly authenticated
- Check that the user has the correct role
- Verify the user's profile is approved (`is_approved = true`)

#### 7. White/blank page after loading

**Cause:** JavaScript error or missing dependencies

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

#### 8. "Module not found" errors

**Cause:** Dependencies not installed or corrupted

**Solution:**
```bash
npm install
```

---

## 📝 Common Commands Reference

### Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Supabase Commands (Local Setup)

| Command | Description |
|---------|-------------|
| `supabase start` | Start local Supabase services |
| `supabase stop` | Stop local Supabase services |
| `supabase db reset` | Reset database and run migrations |
| `supabase status` | Show running services status |
| `supabase db diff` | Show database schema changes |

### Git Commands

| Command | Description |
|---------|-------------|
| `git clone <url>` | Clone the repository |
| `git pull` | Get latest changes |
| `git status` | Check for changes |

---

## 📁 Project Structure Quick Reference

```
farm-management-system/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin dashboard pages
│   │   └── farmer/     # Farmer dashboard pages
│   ├── types/          # TypeScript types
│   └── integrations/   # Supabase client setup
├── supabase/
│   └── migrations/     # Database schema SQL files
├── public/             # Static assets
├── .env                # Environment variables (create this!)
└── package.json        # Project dependencies
```

---

## ✅ Setup Verification Checklist

Before presenting, verify:

- [ ] Application loads at http://localhost:5173
- [ ] Homepage displays correctly
- [ ] Can navigate to Login page
- [ ] Can navigate to Register page
- [ ] Database connection works (no console errors)
- [ ] Can log in with test credentials
- [ ] Admin dashboard accessible (with admin account)
- [ ] Farmer dashboard accessible (with farmer account)

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check the browser console (F12 → Console tab) for errors
2. Check the terminal where `npm run dev` is running
3. Review the `TECHNICAL_DOCUMENTATION.md` for detailed system information
4. Ensure all prerequisites are installed correctly

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Project:** Farm Management System - Senior Project
