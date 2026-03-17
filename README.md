# Show Me The Menu

A personal weekly meal planning app with AI-powered recipe suggestions, ingredient-based recipe generation, and automatic shopping list creation.

Built with .NET 10 Web API, React + TypeScript (Vite), and PostgreSQL.

## Features

- **Weekly menus** — create and manage weekly meal plans
- **AI menu generation** — Claude picks recipes to maximise ingredient overlap and reduce shopping waste; filter by tags or max cooking time before generating
- **Make from Fridge** — enter what's in your fridge and get a recipe suggestion matched from your saved recipes or generated fresh
- **Recipe library** — create and manage recipes with ingredients, instructions, cooking time, and free-form tags
- **Shopping list** — automatically compiled from a weekly menu's recipes

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running locally on port 5432
- An [Auth0](https://auth0.com/) account (free tier works)
- An [Anthropic](https://console.anthropic.com/) API key (for AI features)

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
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=showmethemenu;Username=postgres;Password=yourpassword
```

### 3. Client environment

Create `client/.env.local`:

```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

## Development

Start both services in separate terminals:

### API (backend)

```bash
dotnet run --project api
```

Runs on `http://localhost:5100`. Migrations are applied automatically on startup.

### Client (frontend)

```bash
cd client
npm install   # first time only
npm run dev
```

Runs on `http://localhost:5173`.

### Anthropic API key

Once logged in, go to **Settings** and enter your Anthropic API key. It's stored per-user in the database and used for AI menu generation and fridge suggestions.

## Project Structure

```
show-me-the-menu/
├── api/                        # .NET 10 Web API
│   ├── Data/                   # EF Core DbContext
│   ├── Dtos/                   # Request/response records
│   ├── Endpoints/              # Minimal API route handlers
│   ├── Extensions/             # ClaimsPrincipal helpers
│   ├── Migrations/             # EF Core migrations
│   ├── Models/                 # Domain entities
│   ├── Services/               # Business logic
│   └── Program.cs
└── client/                     # React + TypeScript (Vite)
    └── src/
        ├── api/                # Typed API client functions
        ├── components/         # Reusable UI components
        ├── pages/              # Route-level page components
        ├── types/              # TypeScript interfaces
        └── utils/              # Shared styles and helpers
```

## API Endpoints

All endpoints require a valid Auth0 JWT except `/api/health`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List all recipes |
| POST | `/api/recipes` | Create a recipe |
| GET | `/api/recipes/tags` | List all unique tags |
| GET | `/api/recipes/:id` | Get a recipe |
| PUT | `/api/recipes/:id` | Update a recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |
| GET | `/api/menus` | List all weekly menus |
| POST | `/api/menus` | Create a weekly menu |
| GET | `/api/menus/:id` | Get a weekly menu |
| PUT | `/api/menus/:id` | Update a weekly menu |
| DELETE | `/api/menus/:id` | Delete a weekly menu |
| PUT | `/api/menus/:id/items` | Set menu items |
| GET | `/api/menus/:id/shopping-list` | Get shopping list for a menu |
| POST | `/api/menus/generate` | AI-generate a weekly menu |
| POST | `/api/ai/fridge-suggestion` | Suggest a recipe from fridge ingredients |
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update settings (API key) |
| GET | `/api/health` | Health check |

AI endpoints and menu generation are rate-limited to **10 requests per minute per user**.

## Deployment

- **Backend + Database**: Railway — link a PostgreSQL service and set `DATABASE_URL`, `Auth0__Domain`, `Auth0__Audience`, and `AllowedOrigins`
- **Frontend**: any static host (Vercel, Netlify, etc.) — set the `VITE_*` environment variables
