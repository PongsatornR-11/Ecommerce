# ShopSphere - Production-Grade Full-Stack E-Commerce Platform

A high-performance, secure, and type-safe e-commerce platform built with **Node.js, Express, TypeScript, Prisma ORM, MySQL, React 18, TanStack Query, Zustand, Tailwind CSS, Stripe, and Docker**.

---

## 🚀 Key Highlights & Architecture

### Backend (Express + TypeScript + Prisma)
* **3-Tier Layered Architecture**: Strict separation of concerns across `Routes` $\rightarrow$ `Controllers` $\rightarrow$ `Services` $\rightarrow$ `Prisma Models`.
* **Enterprise Security**:
  * Dual-token authentication (Short-lived Access Token + HttpOnly Refresh Token Cookie).
  * Rate limiting with `express-rate-limit` for DDoS & brute-force mitigation.
  * Security HTTP headers with `helmet`.
  * Strict CORS origin whitelisting.
* **Resilient Stripe Payments**:
  * Cryptographically verified Stripe Webhooks (`/api/stripe/webhook`) with raw body signature verification.
  * Idempotent order processing preventing double charges or race conditions.
  * Atomic Prisma `$transaction` ensuring stock decrements and order creation occur safely or roll back together.
* **Type-Safe Validation**: Comprehensive request validation schemas using `Zod`.
* **Centralized Error Handling**: Unified `AppError` class with structured error responses and environment-aware stack traces.

### Frontend (React 18 + TypeScript + Vite + Tailwind CSS)
* **Modern State Architecture**:
  * **Server State**: Managed by **TanStack Query (React Query)** with caching, automatic refetching, and query invalidation.
  * **Client/UI State**: Managed by **Zustand** for cart items and responsive drawer state.
* **Design System**: Responsive dark/light glass navigation, animated cart badges, password strength metrics (`zxcvbn`), and accessible forms.
* **Stripe Elements**: Seamless checkout flow with embedded payment elements and fallback confirmation.

### DevOps & Testing
* **Docker & Containerization**: Multi-stage Dockerfiles for Backend & Frontend (with Nginx) + `docker-compose.yml` for 1-command startup.
* **Automated Testing**: Vitest & Supertest automated API integration test suite.
* **CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`) for automated linting, type-checking, schema generation, tests, and builds.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express 4, TypeScript 5, Prisma 5, Zod, Helmet, JWT, Bcrypt |
| **Database** | MySQL 8.0 / PostgreSQL |
| **Payments & Media** | Stripe API 2024, Cloudinary SDK |
| **Frontend** | React 18, Vite, TypeScript, TanStack Query v5, Zustand v5, Tailwind CSS |
| **Testing** | Vitest, Supertest |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions |

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://ecomuser:ecompass@localhost:3306/ecomdb"
JWT_SECRET="your-256-bit-secret-jwt-key"
REFRESH_SECRET="your-256-bit-refresh-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLIENT_URL="http://localhost:5173"
```

### Client (`client/.env`)
```env
VITE_API_URL="http://localhost:5000/api"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 🚦 Quick Start

### 1. Run with Docker Compose (Recommended)
```bash
# Start MySQL database, Server API, and Client with 1 command
docker-compose up --build
```
- Client will be available at: `http://localhost:80`
- Server API will be available at: `http://localhost:5000`

---

### 2. Run Locally

#### Server
```bash
cd server
npm install
npx prisma generate
npx prisma db push # or npx prisma migrate dev
npm run dev        # Starts TypeScript API watcher on port 5000
```

#### Client
```bash
cd client
npm install
npm run dev        # Starts Vite dev server on port 5173
```

---

## 🧪 Testing & Verification

```bash
# Run backend integration tests
cd server
npm test

# Run TypeScript type check
cd server
npm run type-check

# Build frontend production bundle
cd client
npm run build
```

---

## 📄 Stripe Webhook Setup (Local Development)

To test Stripe Webhooks locally with Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
Copy the webhook signing secret output (`whsec_...`) to `server/.env` as `STRIPE_WEBHOOK_SECRET`.
