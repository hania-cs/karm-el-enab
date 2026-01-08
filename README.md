# 🌱 Farm Management System

A comprehensive web application for managing agricultural operations, built with modern web technologies and a serverless architecture.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd farm-management-system

# Install dependencies
npm install

# Create .env file with Supabase credentials
# (See LOCAL_SETUP_GUIDE.md for details)

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📋 Documentation

| Document | Description |
|----------|-------------|
| [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md) | Step-by-step instructions for running locally |
| [PROJECT_REPORT.md](./PROJECT_REPORT.md) | Academic report for project presentation |
| [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) | Detailed technical reference |

---

## ✨ Features

### For Farmers
- 📊 **Dashboard** - Overview of plots, rentals, and activities
- 🌾 **Plot Management** - Track agricultural plots and income
- 🚜 **Equipment Rental** - Browse and request equipment
- 📚 **Educational Booklets** - Access farming resources
- 💬 **Support Tickets** - Communicate with administrators

### For Administrators
- 👥 **User Management** - Approve and manage farmer accounts
- 📋 **Plot Oversight** - Manage all plots and requests
- 🔧 **Equipment Management** - Add, edit, and track equipment
- 📑 **Rental Approvals** - Review and approve rental requests
- 📖 **Content Management** - Create and manage booklets

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State Management** | React Query, React Context |
| **Backend** | Supabase (PostgreSQL, Auth, RLS) |
| **Forms** | React Hook Form, Zod |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── equipment/       # Equipment-related components
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts (Auth)
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client setup
├── pages/               # Page components
│   ├── admin/           # Admin dashboard pages
│   └── farmer/          # Farmer dashboard pages
└── types/               # TypeScript type definitions
```

---

## 🔐 User Roles

| Role | Access Level |
|------|-------------|
| **Farmer** | Personal dashboard, plots, equipment rentals, booklets |
| **Admin** | Full system access, user management, approvals |

---

## 📱 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Farmer Dashboard | `/farmer` | Farmer |
| Farmer Plots | `/farmer/plots` | Farmer |
| Farmer Equipment | `/farmer/equipment` | Farmer |
| Farmer Rentals | `/farmer/rentals` | Farmer |
| Admin Dashboard | `/admin` | Admin |
| Admin Users | `/admin/users` | Admin |
| Admin Plots | `/admin/plots` | Admin |
| Admin Equipment | `/admin/equipment` | Admin |
| Admin Rentals | `/admin/rentals` | Admin |
| Admin Booklets | `/admin/booklets` | Admin |

---

## 🗄️ Database Tables

- `profiles` - User profile information
- `user_roles` - Role assignments (farmer/admin)
- `plots` - Agricultural plot data
- `equipment` - Rental equipment inventory
- `rentals` - Equipment rental records
- `booklets` - Educational content
- `support_tickets` - Support requests
- `ticket_messages` - Ticket conversations
- `plot_requests` - New plot requests

---

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 📄 License

This project was created as a senior project for educational purposes.

---

**Version:** 1.0.0  
**Last Updated:** January 2025
