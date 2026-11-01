# onboardFlow — Docker Development Environment

Decipher Group 28 · Repo: `Team-Decipher/onboardFlow`  
Stack: Next.js (TypeScript) + ASP.NET Core Web API (.NET 10) + PostgreSQL 17 + Azurite (Azure Blob Storage emulator)

## Quick Start (No Node, .NET or Postgres needed on host)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your host user ID/GID in `.env` (Ubuntu/Linux):
   ```bash
   sed -i "s/HOST_UID=1000/HOST_UID=$(id -u)/g" .env
   sed -i "s/HOST_GID=1000/HOST_GID=$(id -g)/g" .env
   ```
3. Start all services with one command:
   ```bash
   docker compose up --build
   ```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/openapi/v1.json
- **Weather API:** http://localhost:5000/WeatherForecast

## Useful Commands

```bash
docker compose up -d                  # Start in background
docker compose logs -f backend        # View backend logs
docker compose ps                     # Service status
docker compose stop                   # Stop services
docker compose down                   # Stop & remove containers (preserves DB volumes)
docker compose exec backend dotnet ef database update --project src/OnboardFlow.Api
```
