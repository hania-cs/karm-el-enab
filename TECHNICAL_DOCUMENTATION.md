# Farm Management System - Technical Documentation

## 📋 Project Overview

This is a **Farm Management System** designed to help farmers manage their agricultural operations efficiently. The system provides tools for managing plots, renting equipment, and accessing educational booklets.

### Key Features
- **User Authentication**: Secure login/registration with role-based access
- **Plot Management**: Track farm plots with area, income, and status
- **Equipment Rental**: Browse and rent farming equipment
- **Educational Booklets**: Access farming guides and resources
- **Admin Dashboard**: Manage users, equipment, rentals, and content

---

## 🏗️ System Architecture

### Serverless Architecture (Backend-as-a-Service)

This project uses a **serverless architecture** powered by **Supabase** (PostgreSQL database + authentication + real-time capabilities). There is no traditional backend server code—instead, the frontend communicates directly with Supabase services.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Application (Vite + TypeScript)       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐    │   │
│  │  │ Pages   │ │Components│ │ Hooks   │ │ Auth Context│    │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └──────┬──────┘    │   │
│  │       │           │           │              │           │   │
│  │       └───────────┴───────────┴──────────────┘           │   │
│  │                           │                               │   │
│  │              Supabase Client SDK                          │   │
│  └───────────────────────────┼───────────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD (Backend)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Gateway                           │   │
│  │         (Authentication, Rate Limiting, CORS)            │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│  ┌────────────┐  ┌────────────────┐  ┌───────────────────┐     │
│  │   Auth     │  │   PostgreSQL   │  │  Edge Functions   │     │
│  │  Service   │  │    Database    │  │   (Optional)      │     │
│  │            │  │                │  │                   │     │
│  │ • Sign up  │  │ • Tables       │  │ • Custom APIs     │     │
│  │ • Sign in  │  │ • RLS Policies │  │ • Webhooks        │     │
│  │ • Sessions │  │ • Triggers     │  │ • Integrations    │     │
│  │ • JWT      │  │ • Functions    │  │                   │     │
│  └────────────┘  └────────────────┘  └───────────────────┘     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Row-Level Security (RLS)                    │   │
│  │     "Backend Logic" - Controls who can access what       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Why Serverless?

| Traditional Backend | Serverless (This Project) |
|---------------------|---------------------------|
| Write API endpoints manually | Database accessed directly via SDK |
| Manage server infrastructure | Fully managed cloud infrastructure |
| Handle authentication code | Built-in auth service |
| Write authorization middleware | Row-Level Security policies |
| Scale servers manually | Auto-scaling included |
| Pay for idle servers | Pay only for usage |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Pre-built accessible UI components |
| **React Router v6** | Client-side routing |
| **React Query** | Server state management & caching |
| **React Hook Form** | Form handling with validation |
| **Zod** | Schema validation |
| **Lucide React** | Icon library |
| **date-fns** | Date manipulation |

### Backend (Supabase Services)
| Service | Purpose |
|---------|---------|
| **PostgreSQL Database** | Data storage |
| **Supabase Auth** | User authentication |
| **Row-Level Security** | Data access control |
| **Edge Functions** | Custom serverless functions (optional) |
| **Realtime** | Live data subscriptions |

---

## 📁 Project Structure

```
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── assets/                 # Images and static files
│   │
│   ├── components/
│   │   ├── equipment/          # Equipment-related components
│   │   │   ├── EquipmentCard.tsx
│   │   │   └── RentalForm.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── ui/                 # Reusable UI components (shadcn)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       ├── table.tsx
│   │       └── ... (40+ components)
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state management
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   └── use-toast.ts        # Toast notification hook
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts       # Supabase client configuration
│   │       └── types.ts        # Auto-generated database types
│   │
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   │
│   ├── pages/
│   │   ├── admin/              # Admin-only pages
│   │   │   ├── AdminBooklets.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminEquipment.tsx
│   │   │   ├── AdminPlots.tsx
│   │   │   ├── AdminRentals.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── farmer/             # Farmer-only pages
│   │   │   ├── FarmerDashboard.tsx
│   │   │   ├── FarmerEquipment.tsx
│   │   │   ├── FarmerPlots.tsx
│   │   │   └── FarmerRentals.tsx
│   │   ├── BookletPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFound.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   │
│   ├── App.tsx                 # Main app with routing
│   ├── index.css               # Global styles & design tokens
│   ├── main.tsx                # App entry point
│   └── vite-env.d.ts           # Vite type declarations
│
├── supabase/
│   ├── config.toml             # Supabase configuration
│   ├── functions/              # Edge functions (if any)
│   └── migrations/             # Database migrations (SQL files)
│
├── .env                        # Environment variables (auto-generated)
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │   user_roles    │
│   (Supabase)    │       │                 │
├─────────────────┤       ├─────────────────┤
│ id (uuid) PK    │◄──────│ user_id (uuid)  │
│ email           │       │ role (enum)     │
│ created_at      │       │ id (uuid) PK    │
└────────┬────────┘       └─────────────────┘
         │
         │ (referenced by)
         ▼
┌─────────────────┐       ┌─────────────────┐
│    profiles     │       │   equipment     │
├─────────────────┤       ├─────────────────┤
│ id (uuid) PK    │       │ id (uuid) PK    │
│ name            │       │ name            │
│ farm_name       │       │ description     │
│ email           │       │ daily_rate      │
│ is_approved     │       │ quantity_avail  │
│ created_at      │       │ image_url       │
│ updated_at      │       │ created_at      │
└────────┬────────┘       │ updated_at      │
         │                └────────┬────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│     plots       │       │    rentals      │
├─────────────────┤       ├─────────────────┤
│ id (uuid) PK    │       │ id (uuid) PK    │
│ user_id (uuid)  │       │ user_id (uuid)  │
│ plot_name       │       │ equipment_id    │
│ area            │       │ start_date      │
│ income_last_year│       │ end_date        │
│ income_status   │       │ quantity        │
│ created_at      │       │ total_cost      │
│ updated_at      │       │ status          │
└─────────────────┘       │ created_at      │
                          │ updated_at      │
┌─────────────────┐       └─────────────────┘
│    booklets     │
├─────────────────┤
│ id (uuid) PK    │
│ title           │
│ preview_text    │
│ content_text    │
│ photo_path      │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### Table Descriptions

#### 1. `profiles`
Stores user profile information. Automatically created when a user registers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key, matches auth.users.id |
| `name` | text | User's display name |
| `farm_name` | text | Name of the user's farm (optional) |
| `email` | text | User's email address |
| `is_approved` | boolean | Whether admin has approved the user |
| `created_at` | timestamp | When profile was created |
| `updated_at` | timestamp | When profile was last updated |

#### 2. `user_roles`
Manages user roles for authorization. Separated from profiles for security.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Reference to auth.users |
| `role` | app_role (enum) | 'admin' or 'farmer' |

#### 3. `plots`
Farm plots owned by farmers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Owner of the plot |
| `plot_name` | text | Name/identifier for the plot |
| `area` | numeric | Size of the plot (in acres/hectares) |
| `income_last_year` | numeric | Revenue from last year |
| `income_status` | text | 'Poor', 'Fair', 'Good', 'Excellent' |
| `created_at` | timestamp | When plot was added |
| `updated_at` | timestamp | When plot was last updated |

#### 4. `equipment`
Farming equipment available for rent.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Equipment name |
| `description` | text | Detailed description |
| `daily_rate` | numeric | Cost per day to rent |
| `quantity_available` | integer | Number of units available |
| `image_url` | text | URL to equipment image |
| `created_at` | timestamp | When added |
| `updated_at` | timestamp | When last updated |

#### 5. `rentals`
Equipment rental requests and history.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Farmer who requested rental |
| `equipment_id` | uuid | Equipment being rented |
| `start_date` | date | Rental start date |
| `end_date` | date | Rental end date |
| `quantity` | integer | Number of units rented |
| `total_cost` | numeric | Calculated total cost |
| `status` | text | 'pending', 'approved', 'rejected', 'completed' |
| `created_at` | timestamp | When request was made |
| `updated_at` | timestamp | When last updated |

#### 6. `booklets`
Educational content for farmers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Booklet title |
| `preview_text` | text | Short description/preview |
| `content_text` | text | Full content |
| `photo_path` | text | Cover image URL |
| `created_at` | timestamp | When created |
| `updated_at` | timestamp | When last updated |

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │     │   Frontend   │     │   Supabase   │
│   Browser    │     │   React App  │     │   Auth       │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       │  1. Enter email/   │                     │
       │     password       │                     │
       │───────────────────►│                     │
       │                    │                     │
       │                    │  2. signUp() or     │
       │                    │     signIn()        │
       │                    │────────────────────►│
       │                    │                     │
       │                    │  3. JWT Token +     │
       │                    │     User object     │
       │                    │◄────────────────────│
       │                    │                     │
       │                    │  4. Store session   │
       │                    │     in localStorage │
       │                    │                     │
       │  5. Redirect to    │                     │
       │     dashboard      │                     │
       │◄───────────────────│                     │
       │                    │                     │
       │  6. All API calls  │                     │
       │     include JWT    │                     │
       │                    │────────────────────►│
       │                    │                     │
       │                    │  7. Validate JWT +  │
       │                    │     Apply RLS       │
       │                    │◄────────────────────│
```

### Role-Based Access Control (RBAC)

The system has two roles defined in the `app_role` enum:

| Role | Access Level |
|------|--------------|
| `farmer` | Can view/manage own plots and rentals |
| `admin` | Full access to all data and user management |

### Row-Level Security (RLS) Policies

RLS policies act as the "backend authorization logic". They run on every database query.

#### Example: Plots Table Policies

```sql
-- Farmers can only see their own plots
CREATE POLICY "Farmers can view their own plots" 
ON public.plots 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can see all plots
CREATE POLICY "Admins can view all plots" 
ON public.plots 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Admins can do everything
CREATE POLICY "Admins can manage all plots" 
ON public.plots 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));
```

#### Security Function

```sql
-- This function checks if a user has a specific role
-- SECURITY DEFINER means it runs with elevated privileges
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### RLS Policy Summary

| Table | Farmers Can | Admins Can |
|-------|-------------|------------|
| `profiles` | View/update own | View/update all |
| `user_roles` | View own | Full access |
| `plots` | View own | Full access |
| `equipment` | View all | Full access |
| `rentals` | View own, create | Full access |
| `booklets` | View all | Full access |

---

## 🔄 Data Flow Examples

### Example 1: Farmer Viewing Their Plots

```
1. Farmer logs in
   └─► AuthContext sets user + role in React state

2. Farmer navigates to /farmer/plots
   └─► FarmerPlots component mounts

3. Component fetches plots
   └─► supabase.from('plots').select('*')

4. Supabase receives request with JWT
   └─► Validates JWT, extracts user_id

5. RLS policy evaluates
   └─► "Farmers can view their own plots"
   └─► WHERE auth.uid() = user_id

6. Only farmer's plots returned
   └─► Data displayed in table
```

### Example 2: Admin Approving a User

```
1. Admin navigates to /admin/users
   └─► AdminUsers component fetches profiles

2. RLS allows admin to see all profiles
   └─► "Admins can view all profiles"

3. Admin clicks "Approve" on a user
   └─► supabase.from('profiles')
       .update({ is_approved: true })
       .eq('id', userId)

4. RLS allows update
   └─► "Admins can update all profiles"

5. Database updated, UI refreshes
```

### Example 3: Equipment Rental Request

```
1. Farmer browses equipment
   └─► Anyone can view equipment (public)

2. Farmer clicks "Rent Now"
   └─► RentalForm modal opens

3. Farmer selects dates and quantity
   └─► Form validates with Zod schema

4. Farmer submits
   └─► supabase.from('rentals').insert({
         user_id: auth.uid(),
         equipment_id: selectedEquipment.id,
         start_date, end_date, quantity, total_cost,
         status: 'pending'
       })

5. RLS validates
   └─► "Farmers can create rentals"
   └─► WITH CHECK (auth.uid() = user_id)

6. Rental created with 'pending' status
   └─► Admin can view and approve/reject
```

---

## 🌐 Routing Structure

```
/                           # HomePage (public)
├── /login                  # LoginPage (public)
├── /register               # RegisterPage (public)
├── /booklet/:id            # BookletPage (public)
│
├── /farmer                 # Protected - farmers only
│   ├── /farmer/dashboard   # FarmerDashboard
│   ├── /farmer/plots       # FarmerPlots
│   ├── /farmer/equipment   # FarmerEquipment
│   └── /farmer/rentals     # FarmerRentals
│
└── /admin                  # Protected - admins only
    ├── /admin/dashboard    # AdminDashboard
    ├── /admin/users        # AdminUsers
    ├── /admin/equipment    # AdminEquipment
    ├── /admin/rentals      # AdminRentals
    ├── /admin/plots        # AdminPlots
    └── /admin/booklets     # AdminBooklets
```

### Route Protection

```tsx
// ProtectedRoute component checks:
// 1. Is user authenticated?
// 2. Does user have required role?

<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🎨 Design System

### Color Tokens (HSL)

The design system uses CSS custom properties defined in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;          /* White */
  --foreground: 222.2 84% 4.9%;     /* Dark text */
  --primary: 142.1 76.2% 36.3%;     /* Green */
  --secondary: 210 40% 96.1%;       /* Light gray */
  --muted: 210 40% 96.1%;           /* Muted background */
  --accent: 210 40% 96.1%;          /* Accent color */
  --destructive: 0 84.2% 60.2%;     /* Red for errors */
  --border: 214.3 31.8% 91.4%;      /* Border color */
  --ring: 142.1 76.2% 36.3%;        /* Focus ring */
}

.dark {
  --background: 222.2 84% 4.9%;     /* Dark background */
  --foreground: 210 40% 98%;        /* Light text */
  /* ... dark mode variants */
}
```

### Typography

- **Primary Font**: Outfit (display)
- **Body Font**: Inter (readable)

### Component Library

All UI components are from shadcn/ui, customized in `src/components/ui/`:
- Buttons, Cards, Dialogs, Forms, Tables, etc.
- Fully accessible (ARIA compliant)
- Customizable via Tailwind classes

---

## 🚀 Deployment

### Frontend Deployment

The frontend is deployed automatically through Lovable:

1. Click "Publish" in the Lovable editor
2. Get a `.lovable.app` subdomain
3. Optionally connect a custom domain

### Backend (Supabase)

The backend is fully managed:
- Database hosted on Supabase cloud
- Auto-scaling based on usage
- Daily backups included
- SSL/TLS encryption

---

## 🔧 Local Development Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **bun**
3. **Git**
4. **Docker Desktop** (for local Supabase)
5. **Supabase CLI**

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <project-folder>

# 2. Install dependencies
npm install

# 3. Install Supabase CLI
npm install -g supabase

# 4. Start Docker Desktop

# 5. Initialize local Supabase
supabase init

# 6. Start local Supabase services
supabase start

# This outputs local credentials:
# API URL: http://127.0.0.1:54321
# anon key: eyJhbG...

# 7. Apply database migrations
supabase db reset

# 8. Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<your-local-anon-key>
VITE_SUPABASE_PROJECT_ID=local
EOF

# 9. Import CSV data (optional)
# Open http://127.0.0.1:54323 (Supabase Studio)
# Navigate to each table and import CSVs

# 10. Start development server
npm run dev

# App runs at http://localhost:5173
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

---

## 📊 Feature Details

### 1. User Registration & Approval

**Flow:**
1. User registers with email, password, name, farm name
2. Profile created automatically (trigger)
3. User assigned 'farmer' role by default
4. `is_approved` set to `false`
5. Admin reviews and approves user
6. User can now access farmer features

### 2. Plot Management

**Farmers can:**
- Add new plots with name, area, income data
- View their plot statistics
- Update plot information

**Admins can:**
- View all farmers' plots
- Monitor farm productivity across platform

### 3. Equipment Rental System

**Process:**
1. Admin adds equipment with details and pricing
2. Farmers browse available equipment
3. Farmer submits rental request
4. Admin approves/rejects request
5. Equipment availability updated
6. Rental marked complete when returned

### 4. Educational Booklets

**Features:**
- Admin creates/edits booklets
- All users can view booklets
- Supports preview text and full content
- Optional cover images

---

## 🛡️ Security Considerations

### Implemented Security Measures

1. **Row-Level Security (RLS)**: All tables protected
2. **Role Separation**: Roles stored in separate table
3. **JWT Authentication**: Secure token-based auth
4. **Input Validation**: Zod schemas on forms
5. **HTTPS**: All traffic encrypted

### Best Practices Followed

- No sensitive data in localStorage (except auth tokens)
- SQL injection prevented by Supabase client
- XSS prevented by React's JSX escaping
- CSRF tokens handled by Supabase

---

## 📝 API Reference

### Supabase Client Usage

```typescript
import { supabase } from "@/integrations/supabase/client";

// Select data
const { data, error } = await supabase
  .from('plots')
  .select('*')
  .eq('user_id', userId);

// Insert data
const { data, error } = await supabase
  .from('plots')
  .insert({ plot_name: 'Field A', area: 10 });

// Update data
const { data, error } = await supabase
  .from('plots')
  .update({ area: 15 })
  .eq('id', plotId);

// Delete data
const { error } = await supabase
  .from('plots')
  .delete()
  .eq('id', plotId);

// Authentication
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { name, farm_name, role: 'farmer' } }
});
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Permission denied" error | Check RLS policies, ensure user is authenticated |
| Data not appearing | Verify RLS allows SELECT for user's role |
| Login not working | Check if email confirmation is disabled |
| Local Supabase not starting | Ensure Docker Desktop is running |

### Debug Tips

1. Check browser console for errors
2. Use Supabase Studio to inspect data
3. Verify JWT token in localStorage
4. Check network tab for API responses

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Query Documentation](https://tanstack.com/query)

---

## 👩‍💻 Author

Created as a senior project for farm management operations.

---

*Last Updated: December 2024*
