# onboardFlow — Docker Development Environment

**Team:** Decipher Group 28 · **Repo:** `Team-Decipher/onboardFlow`  
**Stack:** Next.js 16 (App Router + React 19 + TypeScript + Tailwind CSS) · ASP.NET Core Web API (.NET 10 C#) · PostgreSQL 17 · Azurite (Azure Blob Storage Emulator)

---

## 🎯 Goal & Architecture

Every team member runs the **exact same toolchain versions** using Docker with a single command:

```bash
docker compose up
```

### 💡 Why this setup?
* **Zero Host Toolchains:** Nobody needs to install Node.js, npm, .NET SDK, or PostgreSQL on their host machine. Everything runs isolated in Docker containers.
* **Live Coding (Bind Mounts):** Your project code stays on your local machine (`frontend/` and `backend/`). When you edit files in your favorite IDE (VS Code, Antigravity, Cursor, etc.), the changes are instantly reflected inside the containers with **Hot Reload**!
* **No Environment Drift:** "It worked on my machine" is eliminated. Everyone shares identical OS and library dependencies.

```
                    +---------------------------------------------+
                    |                YOUR BROWSER                 |
                    +----------------------+----------------------+
                                           |
             http://localhost:3000         |   http://localhost:5000
                       |                   |             |
                       v                   |             v
          +-------------------------+      |      +------------------------+
          |   frontend Container    |      |      |   backend Container    |
          | (Next.js 16 + Node 24)  |------+      |  (ASP.NET Core .NET 10)|
          +-------------------------+             +------------------------+
                       |                                     |
                       | (internal: backend:8080)            | (internal: db:5432)
                       v                                     v
          +-------------------------+             +------------------------+
          |    azurite Container    |             |       db Container     |
          |  (Azure Blob Emulator)  |             |     (PostgreSQL 17)    |
          +-------------------------+             +------------------------+
```

---

## 🚀 Quick Start (First Time After Cloning)

### 1. Prerequisites (Host Machine Only)
You only need:
* **Git**
* **Docker Engine** with **Docker Compose plugin** (v2+)

> **OS Notes:**
> * **Linux (Ubuntu):** Install Docker via official Docker apt repository. Add your user to the `docker` group (`sudo usermod -aG docker $USER`).
> * **Windows:** Install **WSL2** + Ubuntu and Docker Desktop with WSL2 backend. **Clone the repository inside your WSL2 filesystem** (`~/projects/...`), NOT on `C:\`.
> * **macOS:** Install Docker Desktop.

---

### 2. Configure Environment (`.env`)
Clone the repository and copy the environment configuration:

```bash
git clone https://github.com/jayanathsp-24/SE_Project_Docker_Demo-.git
cd SE_Project_Docker_Demo-
cp .env.example .env
```

#### Set User File Ownership (Linux / Ubuntu Users):
To ensure files created inside containers are owned by your user and not `root`, set your User ID and Group ID in `.env`:

```bash
sed -i "s/HOST_UID=1000/HOST_UID=$(id -u)/g" .env
sed -i "s/HOST_GID=1000/HOST_GID=$(id -g)/g" .env
```
*(Windows WSL2 and macOS users can leave them as 1000).*

---

### 3. Start the Environment
Launch all 4 services with one command:

```bash
docker compose up --build
```

*(On the very first run, Docker will build the dev images and pull PostgreSQL/Azurite. This takes 2–3 minutes, then is permanently cached).*

### 🌐 Access Your Services
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
* **Backend API Swagger / OpenAPI:** [http://localhost:5000/openapi/v1.json](http://localhost:5000/openapi/v1.json)
* **Sample Weather Endpoint:** [http://localhost:5000/WeatherForecast](http://localhost:5000/WeatherForecast)
* **PostgreSQL Database:** `127.0.0.1:5432` (User: `onboard`, Password: `change_me_locally`, DB: `onboardflow`)
* **Azurite Blob Storage:** `127.0.0.1:10000`

---

## 💻 How to Code in This Setup

### Open the Project
Open the **root folder** of this repository in your IDE (VS Code, Cursor, Antigravity):
```bash
code .
```

### 1. Frontend Development (`./frontend`)
* All Next.js source code is located in `frontend/app/`.
* When you edit `frontend/app/page.tsx` or create components in `frontend/`, Turbopack hot-reloads the changes in your browser within milliseconds.
* **API Calls from Frontend:**
  * **Browser Components (Client):** Use `process.env.NEXT_PUBLIC_API_URL` (points to `http://localhost:5000`).
  * **Server Components / Route Handlers (Server-Side):** Use `process.env.API_URL_INTERNAL` (points to `http://backend:8080` on the container network).

### 2. Backend Development (`./backend`)
* All C# ASP.NET Core source code is located in `backend/src/OnboardFlow.Api/`.
* Controllers are in `backend/src/OnboardFlow.Api/Controllers/`.
* Data Models & DbContext are in `backend/src/OnboardFlow.Api/Data/`.
* `dotnet watch` runs automatically inside the backend container. Whenever you save a `.cs` file, it detects the change, rebuilds in ~1–2 seconds, and hot reloads without restarting the container.

---

## 📦 Managing Packages & Dependencies

> ⚠️ **GOLDEN RULE:** **NEVER run `npm install` or `dotnet add` on your host machine!**  
> Running package managers on the host creates platform-dependent binaries or permission conflicts. Always run them inside the running containers using `docker compose exec`.

### Adding Frontend npm Packages
Run from your terminal in the repository root:
```bash
docker compose exec frontend npm install <package-name>
# Example:
docker compose exec frontend npm install lucide-react axios
```
This updates `package.json` and `package-lock.json` on your host machine and installs packages into `node_modules` inside the container. **Commit both files to Git.**

When another teammate pulls your changes, the container entrypoint automatically detects that `package-lock.json` changed and runs `npm install` for them on startup!

### Adding Backend NuGet Packages
Run from your terminal in the repository root:
```bash
docker compose exec backend dotnet add src/OnboardFlow.Api package <PackageName>
# Example:
docker compose exec backend dotnet add src/OnboardFlow.Api package BCrypt.Net-Next
```

---

## 🗄️ Database & Migrations Workflow

We use **Entity Framework Core 10** with **PostgreSQL 17**.

### 1. Create a New Migration
When you create or update an Entity / DbSet in `backend/src/OnboardFlow.Api/`:
```bash
docker compose exec backend dotnet ef migrations add <MigrationName> --project src/OnboardFlow.Api
# Example:
docker compose exec backend dotnet ef migrations add AddUserTable --project src/OnboardFlow.Api
```
Commit the generated migration files in `backend/src/OnboardFlow.Api/Migrations/` to Git.

### 2. Apply Migrations to the Database
Whenever you pull new migrations or want to apply yours:
```bash
docker compose exec backend dotnet ef database update --project src/OnboardFlow.Api
```

### 3. Connect to the Database via CLI (psql)
```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

### 4. Reset Local Database
If you ever want to start over with a fresh, empty database:
```bash
docker compose down -v
docker compose up -d
docker compose exec backend dotnet ef database update --project src/OnboardFlow.Api
```
*(Note: `-v` deletes the PostgreSQL data volume).*

---

## 🛠️ Daily Command Cheat Sheet

| Action | Command |
|---|---|
| Start services in background | `docker compose up -d` |
| View live logs of all services | `docker compose logs -f` |
| View live logs of backend | `docker compose logs -f backend` |
| View live logs of frontend | `docker compose logs -f frontend` |
| Check service health & status | `docker compose ps` |
| Open a bash shell inside backend | `docker compose exec backend bash` |
| Open a shell inside frontend | `docker compose exec frontend sh` |
| Pause services without losing data | `docker compose stop` |
| Resume stopped services | `docker compose start` |
| Stop and remove containers (keeps data) | `docker compose down` |
| Rebuild containers after Dockerfile change | `docker compose up -d --build` |
| Check RAM & CPU consumption | `docker stats` |

---

## 🛡️ Git Best Practices & Team Rules

1. **Never Commit Secrets or Local Environment Files:**
   * `.env` is gitignored. Each developer maintains their own local `.env`.
   * Add new environment variable templates to `.env.example` and commit that instead.
2. **Never Commit Generated Build Folders:**
   * `node_modules/`, `.next/`, `bin/`, `obj/` are strictly ignored by `.gitignore`.
3. **Always Commit Migrations:**
   * Entity migrations must be committed to Git so everyone shares the exact database schema.
4. **Ports Bound to `127.0.0.1`:**
   * All container ports are bound to `127.0.0.1` locally for security.

---

## ❓ Troubleshooting & FAQs

### Q: Port 3000, 5000, or 5432 is already in use
**Fix:** If you have another application or local PostgreSQL running on those ports, change the port mapping in your local `.env` file (e.g., `FRONTEND_PORT=3001` or `API_PORT=5001`). No container code changes needed!

### Q: File permission issues on Linux (`Permission Denied`)
**Fix:** Make sure `HOST_UID` and `HOST_GID` in your `.env` match your user ID (`id -u` and `id -g`). If files were previously created as root, run once on your host:
```bash
sudo chown -R $USER:$USER frontend backend
```

### Q: File changes are not hot reloading (macOS or Windows outside WSL2)
**Fix:** Enable file polling by uncommenting these two lines in `.env`:
```dotenv
WATCHPACK_POLLING=true
DOTNET_USE_POLLING_FILE_WATCHER=1
```

### Q: How do I test the API from my browser without CORS errors?
**Fix:** The API has CORS pre-configured to accept requests from `http://localhost:3000`. If you change `FRONTEND_PORT`, update `Cors__AllowedOrigins__0` or add it to `.env`.

---

**Happy Coding! 🚀**  
For questions or issues with this Docker environment, reach out to Decipher Group 28.
