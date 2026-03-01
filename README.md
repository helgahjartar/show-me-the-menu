# Show Me The Menu

A weekly meal planning app for managing recipes and weekly menus, with AI-powered menu generation and recipe suggestions.

Built with .NET 8 Web API, React + TypeScript (Vite), and PostgreSQL.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v20+)
- [PostgreSQL](https://www.postgresql.org/) running locally on port 5432
- An [Auth0](https://auth0.com/) account (free tier works)

## Setup

### 1. Database

Create a local PostgreSQL database:

```bash
createdb showmethemenu
```

### 2. API environment

Create `api/.env`:

```
Auth0__Domain=your-auth0-domain.auth0.com
Auth0__Audience=your-auth0-audience
ConnectionStrings__DefaultConnection=Host=localhost;Database=showmethemenu;Include Error Detail=true
```

### 3. Client environment

Create `client/.env.local`:

```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

## Development

Start both services in separate terminals:

### API (backend)

```bash
cd api
dotnet run
```

Runs on http://localhost:5100. Swagger UI at http://localhost:5100/swagger.

Migrations are applied automatically on startup.

### Client (frontend)

```bash
cd client
npm install   # first time only
npm run dev
```

Runs on http://localhost:5173. API calls to `/api/*` are proxied to the backend.

## Running Tests

```bash
cd api.Tests
dotnet test
```

## Project Structure

```
show-me-the-menu/
├── ShowMeTheMenu.sln
├── api/                        # .NET 8 Web API
│   ├── Data/                   # EF Core DbContext
│   ├── Endpoints/              # Minimal API route handlers
│   ├── Migrations/             # EF Core migrations
│   ├── Models/                 # Domain entities
│   ├── Services/               # Business logic
│   ├── Dtos/                   # Request/response shapes
│   └── Program.cs
├── api.Tests/                  # Unit tests
└── client/                     # React + TypeScript (Vite)
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── services/
        └── types/
```

## Deployment

- **Frontend**: Vercel (root directory: `client`)
- **Backend**: Railway (set `DATABASE_URL` by linking a PostgreSQL service)
