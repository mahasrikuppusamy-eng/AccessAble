# AccessAble – Accessibility Discovery Platform

> **"Explore the World Without Barriers"**  
> A modern, responsive, and fully functional MERN stack web application empowering people with disabilities to discover verified wheelchair accessible, sensory-friendly, and barrier-free public places.

---

## 1. Project Overview

AccessAble is a specialized accessibility discovery platform that bridges the gap between public venue information and universal accessibility needs. It enables people with mobility, visual, auditory, and cognitive disabilities to search for accessible public places, review detailed checkpoint checklists, read community feedback, submit ratings, and bookmark favorite barrier-free destinations.

### Key Highlights
- **11 Universal Accessibility Checkpoints**: Audits for wheelchair ramps, elevators, accessible restrooms, braille signage, ASL support, and hearing loop installations.
- **Dynamic Accessibility Score**: Real-time calculation of verification percentage for every listed facility.
- **Interactive Leaflet Discovery Map**: Real-time geolocation coordinates, interactive pins, and popups.
- **WCAG 2.2 AA Accessibility Toolbar**: Instant text size scaling, high-contrast mode, dyslexia-friendly typography, and link highlighting.
- **Role-Based Workflows**: Regular users can suggest places, post reviews, and save favorites; Administrators can audit submissions, manage users, and moderate reviews.
- **Dual Database Architecture**: Connects seamlessly to MongoDB or automatically runs in-memory MongoDB fallback with zero configuration hurdles.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v19 with Vite)
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios with automated JWT interceptors
- **Styling**: Vanilla CSS Design System with WCAG 2.2 AA compliant palette, modern typography, glassmorphism, and responsive CSS Grid
- **Interactive Mapping**: Leaflet & OpenStreetMap
- **Icons**: React Icons (FontAwesome, Material Design, BoxIcons)

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js (REST API)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.js password hashing
- **File Uploads**: Multer disk storage for place and profile images
- **Zero-Config Fallback**: `mongodb-memory-server` auto-activates if local MongoDB daemon is unavailable

---

## 3. The 11 Universal Accessibility Checkpoints

Every venue on AccessAble is audited against 11 standardized checkpoints:

| # | Checkpoint | Description |
|---|---|---|
| 1 | **Wheelchair Accessible** | Step-free wide pathways, zero floor-level obstructions, and 60" turn radius. |
| 2 | **Wheelchair Ramps** | ADA compliant gentle slope (1:12 maximum) with dual handrails. |
| 3 | **Accessible Parking** | Designated extra-wide spaces with direct curb-cut ramp to entrance. |
| 4 | **Accessible Restrooms** | Barrier-free stalls with sturdy grab bars, emergency pull cords, and lowered sinks. |
| 5 | **Elevator Availability** | Spacious passenger elevators with voice announcements and low Braille buttons. |
| 6 | **Braille Signage** | Raised tactile lettering and Grade 2 Braille on all doors and directional maps. |
| 7 | **Audio Assistance** | Talking beacons, audible announcements, and voice-assisted digital kiosks. |
| 8 | **Visual Assistance** | High-contrast wayfinding signage, tactile indicator tiles, and uniform glare-free lighting. |
| 9 | **Sign Language Support** | ASL trained staff members or on-demand video relay interpreter services. |
| 10 | **Accessible Entrance** | Automatic sliding doors, push-button switches, and zero ground threshold steps. |
| 11 | **Hearing Assistance** | Induction hearing loops (T-Coil) and personal assistive listening headsets. |

---

## 4. Required Pages (All 14 Implemented)

1. **Home Page (`/`)**  
   Hero section ("Explore the World Without Barriers"), search bar with category and city jump, 11 categories grid, featured verified places, "How It Works" 4-step illustrated guide, community testimonials, and footer.

2. **Explore Places Page (`/places`)**  
   Complete discovery directory with search bar, category pills, accessibility feature checklist dropdown, sort selector (Rating, Most Reviewed, Newest, Name), pagination, and View Mode switcher (Grid vs Split Interactive Map).

3. **Place Details Page (`/places/:id`)**  
   Showcases place photos, 11-feature checklist matrix, accessibility score gauge, contact info & operating hours, interactive Leaflet entrance map, Google Maps directions link, average rating breakdown, interactive review submission form, and community reviews list with edit/delete controls.

4. **Accessibility Filter Page (`/filter`)**  
   Multi-criteria accessibility matrix where users toggle any combination of the 11 checkpoints with real-time matched results counter.

5. **Add Place Page (`/add-place`)** *(Protected)*  
   Place suggestion form: Basic info, category, description, address, interactive map click-to-pin coordinate picker, image URL/upload, 11-checkpoint selector, and contact details. Regular user submissions enter `pending` status for admin verification.

6. **Register Page (`/register`)**  
   User sign up with full name, email, password confirmation, accessibility preferences tags, and bio.

7. **Login Page (`/login`)**  
   User sign in with password reveal toggle, error alerts, and **One-Click Demo Fill buttons** for effortless testing:
   - `admin@accessable.org` / `admin123`
   - `user@accessable.org` / `user123`

8. **User Dashboard (`/dashboard`)** *(Protected)*  
   Personalized activity hub with user profile overview, activity metric counters, and tabs:
   - Saved Favorites tab (with remove button)
   - My Reviews tab (with edit & delete buttons)
   - My Suggested Places tab (with status badges: Approved, Pending, Rejected)

9. **User Profile Page (`/profile`)** *(Protected)*  
   Edit profile information, custom avatar URL, bio, and accessibility priorities.

10. **Favorites Page (`/favorites`)** *(Protected)*  
    Dedicated view of all bookmarked places with real-time toggle and empty state guide.

11. **Admin Dashboard (`/admin`)** *(Admin Only)*  
    Management console featuring:
    - Platform statistics (Total Places, Pending Approvals, Users, Reviews, Reports)
    - **Pending Approvals Tab**: Inspect submissions, one-click Approve, or Reject with custom reason.
    - **All Places Tab**: Table view of all venues with status pills and delete buttons.
    - **Users Management Tab**: Change user roles (`user` <-> `admin`) or delete users.
    - **Reviews Moderation Tab**: Inspect and delete user reviews across all places.
    - **Accessibility Issue Reports Tab**: Review community-flagged errors.

12. **About Us Page (`/about`)**  
    Mission statement, problem statement on standard navigation apps, and global compliance benchmarks (WCAG 2.2 AA, ADA Title III, EN 301 549, ISO 21542).

13. **Contact Page (`/contact`)**  
    Contact message form, support helpline, email, headquarters address, and FAQ accordion.

14. **404 Not Found Page (`*`)**  
    Accessible 404 illustration with recovery navigation shortcuts.

---

## 5. REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, bio, image, and accessibility needs |

### Places (`/api/places`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/places` | Public | Search, filter by category/features/city, sort & paginate |
| `GET` | `/api/places/:id` | Public | Retrieve single place details with reviews |
| `POST` | `/api/places` | Private | Submit new place (admin: approved, user: pending) |
| `PUT` | `/api/places/:id` | Private | Update place (owner or admin) |
| `DELETE` | `/api/places/:id` | Private | Delete place (admin or owner) |
| `GET` | `/api/places/user/my-places` | Private | Get places submitted by current user |
| `POST` | `/api/places/:id/report` | Public | Report incorrect accessibility info |
| `GET` | `/api/places/meta/options` | Public | Get categories & features metadata |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reviews/:placeId` | Public | Get all reviews for a place |
| `POST` | `/api/reviews/:placeId` | Private | Submit review (recalculates average rating) |
| `PUT` | `/api/reviews/:id` | Private | Update user's own review |
| `DELETE` | `/api/reviews/:id` | Private | Delete review (owner or admin) |
| `GET` | `/api/reviews/user/my-reviews` | Private | Get reviews submitted by current user |

### Favorites (`/api/favorites`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | Private | Get all places bookmarked by user |
| `POST` | `/api/favorites/:placeId` | Private | Add place to favorites |
| `DELETE` | `/api/favorites/:placeId` | Private | Remove place from favorites |
| `GET` | `/api/favorites/check/:placeId` | Private | Check if place is favorited |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Platform statistics overview |
| `GET` | `/api/admin/places/pending` | Admin | Get places awaiting review |
| `GET` | `/api/admin/places/all` | Admin | Get all places regardless of status |
| `PUT` | `/api/admin/places/:id/approve` | Admin | Approve pending place submission |
| `PUT` | `/api/admin/places/:id/reject` | Admin | Reject place submission with reason |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `PUT` | `/api/admin/users/:id/role` | Admin | Change user role (user/admin) |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete a user account |
| `GET` | `/api/admin/reviews` | Admin | List all reviews for moderation |
| `GET` | `/api/admin/reports` | Admin | View community accessibility reports |

---

## 6. Demo Accounts for Testing

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@accessable.org` | `admin123` | Full access to Admin Panel, instant place approval, user moderation |
| **Community User** | `user@accessable.org` | `user123` | Can suggest places, write reviews, bookmark favorites |
| **Explorer** | `david@accessable.org` | `user123` | Low vision reviewer demo account |

*(Tip: On the `/login` page, click either **Admin Demo** or **User Demo** to auto-fill credentials instantly!)*

---

## 7. Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested & verified)
- **npm**: v9.0.0 or higher

### Step 1: Clone or Navigate to Directory
```bash
cd c:\Accessible
```

### Step 2: Install All Dependencies
```bash
# Install root, backend, and frontend packages
npm run install:all
```
*(Or install individually: `cd server && npm install` and `cd ../client && npm install`)*

### Step 3: Configure Environment Variables
Copy `.env.example` to `server/.env` and `client/.env`:
```bash
# Server configuration (server/.env)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/accessable
JWT_SECRET=accessable_super_secure_jwt_secret_token_2026_xyz
JWT_EXPIRE=30d

# Frontend configuration (client/.env)
VITE_API_URL=http://localhost:5000/api
```
> **Note**: If local MongoDB is not running, the server automatically starts an in-memory MongoDB database and auto-seeds all sample data immediately!

### Step 4: Run the Application
In two terminal tabs or using npm scripts:

**Terminal 1 (Backend Server):**
```bash
npm run start:server
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run start:client
# Vite Client starts on http://localhost:3000
```

### Step 5: Open in Browser
Open `http://localhost:3000` in your web browser.

---

## 8. Database Seeding

The database auto-seeds on first launch if empty. To manually re-seed at any time:
```bash
npm run seed
```
This populates:
- 3 test users (including Admin and regular users)
- 11 verified accessible places spanning Hospitals, Restaurants, Hotels, Museums, Parks, Malls, and Transit Hubs
- 5 comprehensive accessibility reviews with checkpoint highlights
- Initial test favorites

---

## 9. Accessibility Compliance (WCAG 2.2 AA)

AccessAble includes a floating Accessibility Toolbar (bottom-left corner) featuring:
- **Font Scaling**: Normal (16px), Large (18px), X-Large (20px)
- **High Contrast Mode**: Crisp black background with vibrant yellow/cyan borders adhering to AAA contrast ratio (7:1)
- **Dyslexia-Friendly Font**: Switches typography to *Atkinson Hyperlegible* with adjusted word spacing
- **Underline Links**: Distinguishes all clickable anchors with bold orange underlines
- **Keyboard Navigation**: Clear 3px focus rings on interactive elements (`:focus-visible`)
- **Semantic ARIA Landmarks**: `role="status"`, `role="alert"`, `aria-label`, and screen reader compatibility

---

## 10. Folder Structure

```
AccessAble/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── AccessibilityBadges.jsx   # 11-feature icons & badges
│   │   │       ├── AccessibilityToolbar.jsx  # WCAG AA preference widget
│   │   │       ├── AlertBanner.jsx           # Notification alerts
│   │   │       ├── Footer.jsx                # Responsive footer
│   │   │       ├── LeafletMap.jsx            # Interactive OpenStreetMap
│   │   │       ├── LoadingSpinner.jsx        # Accessible loader
│   │   │       ├── Navbar.jsx                # Sticky navigation header
│   │   │       ├── PlaceCard.jsx             # Card with score & favorites
│   │   │       ├── ProtectedRoute.jsx        # User & Admin guards
│   │   │       ├── ReportModal.jsx           # Issue reporting modal
│   │   │       └── StarRating.jsx            # 1-5 star display/picker
│   │   ├── context/
│   │   │   ├── AccessibilityContext.jsx      # Typography & contrast state
│   │   │   └── AuthContext.jsx               # JWT auth & session state
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx                 # Mission & standards
│   │   │   ├── AddPlacePage.jsx              # Submit barrier-free place
│   │   │   ├── AdminDashboardPage.jsx        # Admin approvals & users
│   │   │   ├── ContactPage.jsx               # Contact form & FAQ
│   │   │   ├── DashboardPage.jsx             # User activity dashboard
│   │   │   ├── ExplorePage.jsx               # Places discovery & map
│   │   │   ├── FavoritesPage.jsx             # User bookmarked places
│   │   │   ├── FilterPage.jsx                # 11-feature matrix filter
│   │   │   ├── HomePage.jsx                  # Hero landing page
│   │   │   ├── LoginPage.jsx                 # Sign in with demo buttons
│   │   │   ├── NotFoundPage.jsx              # 404 recovery page
│   │   │   ├── PlaceDetailsPage.jsx          # Place details & reviews
│   │   │   ├── ProfilePage.jsx               # User profile settings
│   │   │   └── RegisterPage.jsx              # Sign up with preferences
│   │   ├── services/
│   │   │   └── api.js                        # Axios instance with interceptors
│   │   ├── styles/
│   │   │   └── index.css                     # Complete Design System CSS
│   │   ├── App.jsx                           # Application routing
│   │   └── main.jsx                          # React root
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                             # MongoDB & In-Memory fallback
│   ├── controllers/
│   │   ├── adminController.js                # Admin approval & stats logic
│   │   ├── authController.js                 # Registration & JWT login
│   │   ├── favoriteController.js             # User favorites bookmarks
│   │   ├── placeController.js                # Search, filter, CRUD
│   │   └── reviewController.js               # Ratings & average recalculation
│   ├── middleware/
│   │   ├── auth.js                           # Protect & authorizeAdmin
│   │   └── upload.js                         # Multer file storage
│   ├── models/
│   │   ├── Favorite.js                       # Favorite Mongoose schema
│   │   ├── Place.js                          # Place & 11 features schema
│   │   ├── Report.js                         # Inaccuracy reports schema
│   │   ├── Review.js                         # Review & rating hook schema
│   │   └── User.js                           # User schema with bcrypt
│   ├── routes/
│   │   ├── adminRoutes.js                    # /api/admin endpoints
│   │   ├── authRoutes.js                     # /api/auth endpoints
│   │   ├── favoriteRoutes.js                 # /api/favorites endpoints
│   │   ├── placeRoutes.js                    # /api/places endpoints
│   │   └── reviewRoutes.js                   # /api/reviews endpoints
│   ├── seed/
│   │   ├── seedData.js                       # Verified sample places & reviews
│   │   └── seed.js                           # Seed runner script
│   ├── utils/
│   │   └── generateToken.js                  # JWT token generator
│   ├── .env
│   ├── package.json
│   └── server.js                             # Express application entry
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 11. Verification & Testing

Both the backend and frontend have been compiled, built, and tested end-to-end:
- **Build**: Vite production bundle compiled in 1.7s (`npm run build`)
- **API Health**: Tested `GET /api/health` -> HTTP 200 `healthy`
- **Authentication**: Tested registration, login, JWT validation, and admin route protection
- **Places & Checkpoints**: Tested multi-criteria search, feature filtering, and status workflows
- **Submission & Approval Lifecycle**: Verified user submission (`pending`) -> admin approval (`approved`) -> public display
- **Reviews & Ratings**: Verified 1-5 star reviews and automatic aggregate rating updates
- **Favorites**: Verified bookmarking and removal endpoints

---

*AccessAble – Building a truly inclusive, barrier-free world for everyone.*
