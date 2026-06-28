# ⚡ Task Management System - Server Architecture API

A modular, production-hardened RESTful API gateway built using an enterprise TypeScript ecosystem. The application layer features specialized pipeline structures optimized for serverless executions and persistent cloud transactional mapping[cite: 1, 2].

## 🚀 Live Production API Target
* **API Gateway Base URL:** [https://task-management-backend-jade-six.vercel.app/api](https://task-management-backend-jade-six.vercel.app/api)

---

## 🛠️ System Stack & Architecture Components
* **Runtime Runtime:** Node.js (Express.js Framework with TypeScript compiler)
* **Object-Relational Mapping (ORM):** TypeORM (Explicit Class entity binding model for Serverless compatibility)
* **Data Layer:** Cloud MySQL Cluster (TiDB Serverless Instance)[cite: 1]
* **Security & Tokens:** JSON Web Tokens (JWT) & Bcrypt password-hashing engines[cite: 1]

---

## 🧠 Core Architectural Implementations
* **Serverless Lazy-Database Connector Middleware:** Intercepts cold starts in serverless functions by evaluating connection pool initialization dynamically before routing runtime logic.
* **Preflight Request Isolation:** Disconnects computational database overheads from incoming preflight `OPTIONS` requests, resolving standard cross-origin latency issues natively at the gateway level.
* **Robust Custom Error Pipelines:** Built-in catch-all middleware layers that map framework exceptions cleanly into standardized JSON responses without exposing internal server stacks.

---

## 📦 Local Installation & Setup

### 1. Repository Cloning
Clone the primary `main` branch to your workstation:
```bash
git clone -b main [https://github.com/Harshana-Prabhath/task-management-backend.git](https://github.com/Harshana-Prabhath/task-management-backend.git)
cd task-management-backend
```

### 2. Dependency Resolution
Install all essential engine execution components:
```bash
npm install
```

### 3. Environment Variable Injection
Create a root level environment file named .env and fill in your cloud database credentials:
```bash
PORT=5000
NODE_ENV=development


DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Root123
DB_NAME=task_management_db


JWT_SECRET=super_secret_key_for_task_app_2026
JWT_EXPIRES_IN=7d
```
### 4. Running the Project Locally
Compile the project and start the live reload server:
```bash
npm run dev
```
s
