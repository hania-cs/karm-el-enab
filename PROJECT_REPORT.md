# Farm Management System
## Senior Project Report

---

**Prepared by:** [Student Name]  
**Course:** [Course Name]  
**Institution:** [Institution Name]  
**Date:** January 2025  
**Supervisor:** [Professor Name]

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Project Objectives](#4-project-objectives)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Design](#7-database-design)
8. [Features and Functionality](#8-features-and-functionality)
9. [User Roles and Permissions](#9-user-roles-and-permissions)
10. [Security Implementation](#10-security-implementation)
11. [User Interface Design](#11-user-interface-design)
12. [Testing and Quality Assurance](#12-testing-and-quality-assurance)
13. [Deployment](#13-deployment)
14. [Challenges and Solutions](#14-challenges-and-solutions)
15. [Future Enhancements](#15-future-enhancements)
16. [Conclusion](#16-conclusion)
17. [References](#17-references)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

The **Farm Management System** is a comprehensive web application designed to modernize agricultural operations by providing farmers with digital tools for managing their farming activities. Built using modern web technologies and a serverless architecture, this system enables farmers to manage their plots, rent equipment, access educational resources, and communicate with administrators—all through an intuitive, responsive interface.

### Key Highlights

- **Full-stack web application** with React frontend and PostgreSQL backend
- **Role-based access control** supporting Farmers and Administrators
- **Serverless architecture** using Supabase for scalability and cost efficiency
- **Mobile-responsive design** accessible from any device
- **Secure authentication** with Row-Level Security policies

### Project Statistics

| Metric | Value |
|--------|-------|
| Total Pages | 13+ |
| Database Tables | 8 |
| User Roles | 2 (Farmer, Admin) |
| RLS Policies | 20+ |
| Technology Stack Components | 15+ |

---

## 2. Introduction

### 2.1 Background

Agriculture remains a cornerstone of the global economy, yet many farming operations still rely on paper-based record-keeping and manual processes. This creates inefficiencies in resource management, makes it difficult to track equipment usage, and limits access to educational materials that could improve farming practices.

### 2.2 Project Overview

The Farm Management System addresses these challenges by providing a centralized digital platform where:

- **Farmers** can manage their agricultural plots, rent equipment, and access educational content
- **Administrators** can oversee operations, approve users, manage resources, and provide support

### 2.3 Scope

This project encompasses:
- User authentication and authorization
- Plot management for farmers
- Equipment rental system with booking and approval workflow
- Educational booklet library
- Support ticket system for farmer-admin communication
- Administrative dashboard for system oversight

---

## 3. Problem Statement

### 3.1 Identified Problems

1. **Fragmented Record-Keeping:** Farmers often use disparate systems (paper, spreadsheets, memory) to track their plots and activities
2. **Equipment Access:** No centralized system for requesting and tracking equipment rentals
3. **Limited Educational Access:** Educational materials about farming best practices are scattered or inaccessible
4. **Communication Barriers:** Farmers lack efficient channels to communicate with agricultural administrators
5. **Administrative Overhead:** Administrators spend excessive time on manual approval and tracking processes

### 3.2 Target Users

| User Type | Description | Primary Needs |
|-----------|-------------|---------------|
| Farmers | Agricultural workers managing plots | Plot tracking, equipment rental, education |
| Administrators | System managers overseeing operations | User management, approvals, reporting |

---

## 4. Project Objectives

### 4.1 Primary Objectives

1. **Develop a user-friendly web application** that simplifies farm management tasks
2. **Implement secure authentication** with role-based access control
3. **Create an equipment rental system** with approval workflows
4. **Build an educational resource library** for farmer development
5. **Establish communication channels** between farmers and administrators

### 4.2 Secondary Objectives

1. Design a responsive interface accessible on mobile devices
2. Implement data security through Row-Level Security policies
3. Create an intuitive administrative dashboard
4. Ensure scalability through serverless architecture

### 4.3 Success Criteria

| Objective | Measurement | Target |
|-----------|-------------|--------|
| User Experience | Page load time | < 3 seconds |
| Security | Authentication success rate | 100% |
| Functionality | Feature completion | All core features |
| Accessibility | Mobile responsiveness | All pages |

---

## 5. Technology Stack

### 5.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | 5.x | Build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **React Router** | 6.x | Client-side routing |
| **React Query** | 5.x | Server state management |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |
| **Lucide React** | Latest | Icon library |

### 5.2 Backend Technologies

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service platform |
| **PostgreSQL** | Relational database |
| **Supabase Auth** | Authentication service |
| **Row-Level Security** | Database-level access control |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub** | Code repository |
| **VS Code** | Code editor |
| **ESLint** | Code linting |

### 5.4 Technology Selection Rationale

**React + TypeScript:** Chosen for component-based architecture and type safety, reducing runtime errors and improving developer experience.

**Tailwind CSS:** Selected for rapid UI development with utility classes, ensuring consistent styling across the application.

**Supabase:** Opted for serverless backend to eliminate server management, reduce costs, and leverage built-in authentication and security features.

---

## 6. System Architecture

### 6.1 Architecture Overview

The system follows a **serverless architecture** pattern, also known as Backend-as-a-Service (BaaS). This approach eliminates the need for traditional server-side code while maintaining full functionality.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │  │
│  │  │   Pages     │ │ Components  │ │   State Management  │  │  │
│  │  │  (Router)   │ │  (shadcn)   │ │   (React Query)     │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE LAYER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐   │
│  │    Auth     │ │  Database   │ │   Row-Level Security    │   │
│  │   (JWT)     │ │ (PostgreSQL)│ │      (RLS Policies)     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow

1. **User Request:** User interacts with React frontend
2. **Authentication:** Supabase Auth validates user credentials
3. **API Call:** Frontend makes request to Supabase REST API
4. **RLS Check:** PostgreSQL applies Row-Level Security policies
5. **Data Return:** Authorized data returned to frontend
6. **UI Update:** React updates the user interface

### 6.3 Benefits of Serverless Architecture

| Benefit | Description |
|---------|-------------|
| **Scalability** | Automatic scaling based on demand |
| **Cost Efficiency** | Pay only for actual usage |
| **Reduced Complexity** | No server management required |
| **Built-in Security** | Authentication and RLS included |
| **Faster Development** | Focus on frontend logic |

---

## 7. Database Design

### 7.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     profiles    │       │   user_roles    │
├─────────────────┤       ├─────────────────┤
│ id (PK, FK)     │───┐   │ id (PK)         │
│ name            │   │   │ user_id (FK)    │───┐
│ email           │   │   │ role            │   │
│ farm_name       │   │   └─────────────────┘   │
│ is_approved     │   │                         │
│ created_at      │   └─────────────────────────┘
│ updated_at      │
└─────────────────┘
        │
        │ user_id
        ▼
┌─────────────────┐       ┌─────────────────┐
│      plots      │       │    equipment    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ name            │
│ plot_name       │       │ description     │
│ area            │       │ quantity_avail  │
│ income_last_year│       │ daily_rate      │
│ income_status   │       │ image_url       │
│ created_at      │       │ created_at      │
│ updated_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘
                                  │
        ┌─────────────────────────┘
        │ equipment_id
        ▼
┌─────────────────┐       ┌─────────────────┐
│     rentals     │       │    booklets     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ title           │
│ equipment_id(FK)│       │ content_text    │
│ quantity        │       │ preview_text    │
│ start_date      │       │ photo_path      │
│ end_date        │       │ created_at      │
│ total_cost      │       │ updated_at      │
│ status          │       └─────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ support_tickets │       │ ticket_messages │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───────│ ticket_id (FK)  │
│ farmer_id (FK)  │       │ id (PK)         │
│ subject         │       │ sender_id (FK)  │
│ status          │       │ message         │
│ created_at      │       │ is_read         │
│ updated_at      │       │ created_at      │
└─────────────────┘       └─────────────────┘

┌─────────────────┐
│  plot_requests  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ requested_name  │
│ requested_area  │
│ notes           │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 7.2 Table Descriptions

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **profiles** | User profile information | name, email, farm_name, is_approved |
| **user_roles** | Role assignments | user_id, role (farmer/admin) |
| **plots** | Farmer's agricultural plots | plot_name, area, income_last_year |
| **equipment** | Available rental equipment | name, quantity_available, daily_rate |
| **rentals** | Equipment rental records | equipment_id, dates, status, total_cost |
| **booklets** | Educational materials | title, content_text, preview_text |
| **support_tickets** | Farmer support requests | subject, status (open/closed) |
| **ticket_messages** | Ticket conversation history | message, sender_id, is_read |
| **plot_requests** | New plot requests | requested_name, requested_area, status |

### 7.3 Database Functions

```sql
-- Check if user has a specific role
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean

-- Handle new user registration
CREATE FUNCTION handle_new_user()
RETURNS trigger

-- Auto-update timestamps
CREATE FUNCTION update_updated_at_column()
RETURNS trigger
```

---

## 8. Features and Functionality

### 8.1 Feature Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    FARM MANAGEMENT SYSTEM                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  AUTHENTICATION  │  │  PLOT MANAGEMENT │  │   EQUIPMENT  │  │
│  │  • Login         │  │  • View plots    │  │   RENTALS    │  │
│  │  • Register      │  │  • Request new   │  │  • Browse    │  │
│  │  • Role-based    │  │  • Track income  │  │  • Request   │  │
│  │    access        │  │                  │  │  • Track     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │    BOOKLETS      │  │  SUPPORT SYSTEM  │  │    ADMIN     │  │
│  │  • Educational   │  │  • Create ticket │  │   DASHBOARD  │  │
│  │    content       │  │  • Messages      │  │  • Users     │  │
│  │  • Best practices│  │  • Status track  │  │  • Approvals │  │
│  │                  │  │                  │  │  • Analytics │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 8.2 Detailed Feature Descriptions

#### 8.2.1 Authentication System

**Registration Process:**
1. User fills registration form (name, email, password, farm name)
2. Account created in pending approval state
3. Administrator reviews and approves account
4. User gains full system access

**Login Process:**
1. User enters credentials
2. System validates against Supabase Auth
3. JWT token issued for session
4. Role-based redirect to appropriate dashboard

#### 8.2.2 Plot Management

| Feature | Description |
|---------|-------------|
| View Plots | List all plots owned by the farmer |
| Plot Details | Area size, income tracking, status |
| Request New Plot | Submit request for additional plot allocation |
| Income Tracking | Record and monitor plot income |

#### 8.2.3 Equipment Rental System

**Rental Workflow:**
```
Farmer browses    →    Selects dates    →    Submits request
equipment              and quantity           
      │                                            │
      ▼                                            ▼
Available items   →    Cost calculated   →    Pending status
displayed              automatically          assigned
                                                   │
                                                   ▼
                       Admin reviews      →    Approved/Rejected
                       request                     │
                                                   ▼
                                              Farmer notified
```

#### 8.2.4 Educational Booklets

- Searchable library of farming resources
- Preview text for quick scanning
- Full content viewing
- Admin-managed content

#### 8.2.5 Support Ticket System

- Create support tickets with subject
- Message-based conversation thread
- Read status tracking
- Admin response capability
- Ticket status management (open/resolved/closed)

### 8.3 Page Inventory

| # | Page | Route | Access |
|---|------|-------|--------|
| 1 | Home | `/` | Public |
| 2 | Login | `/login` | Public |
| 3 | Register | `/register` | Public |
| 4 | Booklet Detail | `/booklet/:id` | Public |
| 5 | Farmer Dashboard | `/farmer` | Farmer |
| 6 | Farmer Plots | `/farmer/plots` | Farmer |
| 7 | Farmer Equipment | `/farmer/equipment` | Farmer |
| 8 | Farmer Rentals | `/farmer/rentals` | Farmer |
| 9 | Admin Dashboard | `/admin` | Admin |
| 10 | Admin Users | `/admin/users` | Admin |
| 11 | Admin Plots | `/admin/plots` | Admin |
| 12 | Admin Equipment | `/admin/equipment` | Admin |
| 13 | Admin Rentals | `/admin/rentals` | Admin |
| 14 | Admin Booklets | `/admin/booklets` | Admin |

---

## 9. User Roles and Permissions

### 9.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    ADMINISTRATOR                         │
│  • Full system access                                    │
│  • User management (approve, manage)                     │
│  • Content management (equipment, booklets)              │
│  • All farmer capabilities                               │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Includes all permissions of
                          ▼
┌─────────────────────────────────────────────────────────┐
│                       FARMER                             │
│  • View own plots                                        │
│  • Request equipment rentals                             │
│  • View educational booklets                             │
│  • Create and manage support tickets                     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Includes all permissions of
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC (Unauthenticated)              │
│  • View homepage                                         │
│  • View booklets listing                                 │
│  • Register account                                      │
│  • Login                                                 │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Permission Matrix

| Resource | Action | Public | Farmer | Admin |
|----------|--------|--------|--------|-------|
| **Profiles** | View Own | ❌ | ✅ | ✅ |
| **Profiles** | View All | ❌ | ❌ | ✅ |
| **Profiles** | Update Own | ❌ | ✅ | ✅ |
| **Profiles** | Approve | ❌ | ❌ | ✅ |
| **Plots** | View Own | ❌ | ✅ | ✅ |
| **Plots** | View All | ❌ | ❌ | ✅ |
| **Plots** | Create | ❌ | ❌ | ✅ |
| **Plot Requests** | Create | ❌ | ✅ | ✅ |
| **Plot Requests** | Approve | ❌ | ❌ | ✅ |
| **Equipment** | View | ✅ | ✅ | ✅ |
| **Equipment** | Manage | ❌ | ❌ | ✅ |
| **Rentals** | Create | ❌ | ✅ | ✅ |
| **Rentals** | View Own | ❌ | ✅ | ✅ |
| **Rentals** | View All | ❌ | ❌ | ✅ |
| **Rentals** | Approve/Reject | ❌ | ❌ | ✅ |
| **Booklets** | View | ✅ | ✅ | ✅ |
| **Booklets** | Manage | ❌ | ❌ | ✅ |
| **Support Tickets** | Create | ❌ | ✅ | ❌ |
| **Support Tickets** | View Own | ❌ | ✅ | ✅ |
| **Support Tickets** | Respond | ❌ | ✅ | ✅ |

---

## 10. Security Implementation

### 10.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Transport Security                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • HTTPS encryption for all communications              │ │
│  │  • TLS 1.3 protocol                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▼                                   │
│  Layer 2: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Supabase Auth (industry-standard)                    │ │
│  │  • JWT tokens with expiration                           │ │
│  │  • Secure password hashing (bcrypt)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▼                                   │
│  Layer 3: Authorization (Row-Level Security)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Database-enforced access control                     │ │
│  │  • Role-based policies                                  │ │
│  │  • User-specific data isolation                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▼                                   │
│  Layer 4: Input Validation                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Zod schema validation                                │ │
│  │  • Type-safe data handling                              │ │
│  │  • SQL injection prevention                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Row-Level Security (RLS) Policies

**Example: Farmers can only view their own plots**

```sql
CREATE POLICY "Farmers can view their own plots" 
ON public.plots 
FOR SELECT 
USING (auth.uid() = user_id);
```

**Example: Admins can view all plots**

```sql
CREATE POLICY "Admins can view all plots" 
ON public.plots 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));
```

### 10.3 Security Best Practices Implemented

| Practice | Implementation |
|----------|----------------|
| Secure Authentication | Supabase Auth with JWT |
| Password Security | Bcrypt hashing (handled by Supabase) |
| Role Separation | Separate user_roles table |
| Data Isolation | RLS policies on all tables |
| Input Validation | Zod schemas for all forms |
| HTTPS | Enforced for all connections |
| No Hardcoded Secrets | Environment variables used |

---

## 11. User Interface Design

### 11.1 Design Principles

1. **Consistency:** Unified design language across all pages
2. **Accessibility:** WCAG 2.1 compliant components
3. **Responsiveness:** Mobile-first approach
4. **Clarity:** Clear visual hierarchy and navigation

### 11.2 Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Primary | Purple/Grape | Lighter Purple | Buttons, links, highlights |
| Secondary | Muted purple | Dark purple | Secondary actions |
| Background | Light gray | Dark gray | Page backgrounds |
| Foreground | Dark text | Light text | Primary text |
| Accent | Lavender | Deep purple | Highlights, badges |
| Destructive | Red | Red | Error states, delete actions |
| Success | Green | Green | Success messages |

### 11.3 Typography

| Element | Font Family | Weight | Size |
|---------|-------------|--------|------|
| Headings | Outfit | 600-700 | 24-48px |
| Body | Inter | 400-500 | 14-16px |
| Labels | Inter | 500 | 12-14px |
| Buttons | Inter | 500 | 14px |

### 11.4 Component Library

Built using **shadcn/ui**, providing:
- Accessible by default
- Fully customizable
- Consistent behavior
- Keyboard navigation support

Key components used:
- Button, Card, Dialog, Table
- Form, Input, Select, Checkbox
- Toast notifications
- Navigation menu
- Data tables with sorting/filtering

---

## 12. Testing and Quality Assurance

### 12.1 Testing Approach

| Type | Description | Tools |
|------|-------------|-------|
| Type Checking | Static type analysis | TypeScript |
| Linting | Code style enforcement | ESLint |
| Manual Testing | User flow verification | Browser DevTools |
| Security Testing | RLS policy verification | Supabase Dashboard |

### 12.2 Quality Checklist

- [x] All pages render without errors
- [x] Forms validate input correctly
- [x] Authentication flows work correctly
- [x] Role-based access enforced
- [x] Responsive on mobile devices
- [x] Error messages are user-friendly
- [x] Loading states displayed appropriately

---

## 13. Deployment

### 13.1 Production Deployment

The application is deployed using:
- **Frontend:** Lovable hosting platform
- **Backend:** Supabase cloud infrastructure

### 13.2 Deployment Process

1. Code changes pushed to GitHub
2. Lovable automatically builds and deploys
3. Database migrations applied via Supabase
4. Environment variables configured securely

### 13.3 Local Development

See `LOCAL_SETUP_GUIDE.md` for complete instructions.

---

## 14. Challenges and Solutions

### 14.1 Technical Challenges

| Challenge | Solution |
|-----------|----------|
| Complex authorization requirements | Implemented RLS with helper functions |
| Real-time data updates | React Query for caching and refetching |
| Form validation complexity | Zod schemas with React Hook Form |
| Mobile responsiveness | Tailwind CSS responsive utilities |

### 14.2 Design Challenges

| Challenge | Solution |
|-----------|----------|
| Consistent UI across pages | shadcn/ui component library |
| Dark mode support | CSS custom properties with theme toggle |
| Data visualization | Clean table layouts with status badges |

---

## 15. Future Enhancements

### 15.1 Short-term Improvements

1. **Email Notifications:** Alert users on approval, rental status changes
2. **Image Uploads:** Equipment and booklet image management
3. **Export Reports:** PDF/CSV export for plots and rentals
4. **Password Reset:** Self-service password recovery

### 15.2 Long-term Vision

1. **Mobile App:** Native iOS/Android application
2. **Weather Integration:** Real-time weather data for farming decisions
3. **Analytics Dashboard:** Visual charts and insights
4. **Marketplace:** Farmer-to-farmer equipment sharing
5. **IoT Integration:** Sensor data from farm equipment

---

## 16. Conclusion

The Farm Management System successfully achieves its primary objectives of providing a digital platform for agricultural management. Key accomplishments include:

### 16.1 Achievements

- **Functional Application:** All core features implemented and working
- **Secure Architecture:** Database-level security with RLS policies
- **User-Friendly Interface:** Intuitive design accessible to non-technical users
- **Scalable Foundation:** Serverless architecture ready for growth
- **Complete Documentation:** Comprehensive guides for setup and maintenance

### 16.2 Learning Outcomes

Through this project, the following skills were developed and demonstrated:

- Modern frontend development with React and TypeScript
- Database design and security implementation
- User experience design principles
- Full-stack application architecture
- Technical documentation writing

### 16.3 Final Remarks

This project demonstrates the effective application of modern web technologies to solve real-world agricultural management challenges. The serverless architecture ensures cost-effectiveness and scalability, while the comprehensive security measures protect user data. The system is ready for production use and provides a solid foundation for future enhancements.

---

## 17. References

### 17.1 Technologies and Documentation

1. React Documentation - https://react.dev
2. TypeScript Handbook - https://www.typescriptlang.org/docs/
3. Supabase Documentation - https://supabase.com/docs
4. Tailwind CSS - https://tailwindcss.com/docs
5. shadcn/ui Components - https://ui.shadcn.com
6. Vite Build Tool - https://vitejs.dev

### 17.2 Design Resources

1. Lucide Icons - https://lucide.dev
2. Inter Font - https://rsms.me/inter/
3. Outfit Font - https://fonts.google.com/specimen/Outfit

---

## 18. Appendices

### Appendix A: Database Schema SQL

See `supabase/migrations/` folder for complete database schema.

### Appendix B: Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_SUPABASE_URL | Supabase project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Supabase anonymous key |
| VITE_SUPABASE_PROJECT_ID | Project identifier |

### Appendix C: File Structure

```
farm-management-system/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── equipment/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   ├── integrations/
│   │   └── supabase/
│   ├── pages/
│   │   ├── admin/
│   │   └── farmer/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── config.toml
│   └── migrations/
├── .env
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

### Appendix D: Additional Documentation

- `LOCAL_SETUP_GUIDE.md` - Step-by-step local setup instructions
- `TECHNICAL_DOCUMENTATION.md` - Detailed technical reference
- `README.md` - Project overview

---

**End of Report**

---

*This document was prepared as part of a senior project submission. All code and documentation were created specifically for this project.*
