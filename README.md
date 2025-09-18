# Work Orders App — Next.js Code Test

This project is a **Work Orders Management App** built with **Next.js (App Router + TypeScript)**.
It was implemented as part of a coding test to demonstrate full-stack development skills with authentication, authorization, database operations, and clean UI handling.

---

## 🚀 Tech Stack

* **Next.js (App Router + TypeScript)**
* **TailwindCSS** (v4 via PostCSS)
* **NextAuth** (Credentials + JWT)
* **Prisma ORM** + **SQLite**
* **Zod** (for input validation)

---

## ⚡ Features Implemented

* ✅ **Authentication** with seeded user accounts via NextAuth.
* ✅ **Orders List** with:

  * Server-side pagination (10/page).
  * Search across title & description.
  * Filter by status & priority.
  * Sorted by newest first.
  * Role-based scoping (user → own orders, manager → all orders).
* ✅ **Create Order**:

  * Form with Zod validation.
  * Server action creates order with default status `open`.
  * Auto revalidation of list after create.
* ✅ **Order Detail**:

  * Fetch by ID with access control.
  * Inline editing for title, description, and priority.
  * Managers can also edit status and assign orders.
* ✅ **Authorization** strictly enforced on the server for all reads/writes.
* ✅ **UI States**: Empty, loading, and error states implemented.

---

## 🧑‍💻 Stretch Features (Optional)

* [ ] Single image upload per order.
* [ ] Activity log rendered as a timeline.
* [ ] Role management (promote/demote).
* [ ] Basic rate limiting.

---

## 🔑 Authentication (Seeded Accounts)

* **Manager** → `manager@example.com / Password123!`
* **User** → `user@example.com / Password123!`

---

## 🛠️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/HardCoder404/pixel-nextjs-codetest.git
   cd pixel-nextjs-codetest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run Prisma migrations & seed database**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. Open app in browser:
   [http://localhost:3000](http://localhost:3000)

---

6. Env variables:
   ```bash
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="replace-with-a-long-random-string"
   NEXTAUTH_URL="http://localhost:3000"

   ```

## 📝 Notes & Trade-offs

* Kept UI minimal to focus on core functionality and server-side correctness.
* Used **server actions** for most mutations (instead of APIs) to keep code cleaner.
* Limited error handling for brevity; TODO comments left for improvements.
* Optimistic UI partially implemented; fallback to revalidation for consistency.

---

## ⏱️ Time Spent

Approx. **4.5 hours** (including setup, implementation, and documentation).

---
