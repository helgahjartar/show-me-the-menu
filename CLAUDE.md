# Menu Planning Application

A weekly meal planning app with AI-powered recipe suggestions, ingredient-based recipe generation, and automatic shopping list creation. Single-user application for personal/family use.

## Tech Stack

### Backend
- **.NET 8 Web API**
- **Entity Framework Core** with PostgreSQL (Npgsql provider)
- **Microsoft Semantic Kernel** for AI integration
- Code-first migrations

### Frontend
- **React 18** with **TypeScript**
- **Tailwind CSS** for styling (no component library)
- **Vite** as build tool
- **React Router** for navigation
- **Axios** or **fetch** for API calls

### Infrastructure
- PostgreSQL database
- No authentication (single-user app)

## Architecture

### Backend Structure (Clean Architecture)
```
src/
├── MenuPlanner.Api/              # Web API project (controllers, middleware, Program.cs)
├── MenuPlanner.Application/      # Use cases, services, interfaces, DTOs
├── MenuPlanner.Domain/           # Entities, value objects, enums
├── MenuPlanner.Infrastructure/   # EF Core DbContext, repositories, AI services
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   ├── Configurations/       # EF Core entity configurations
│   │   └── Migrations/
│   ├── Repositories/
│   └── AI/                       # Semantic Kernel plugins and services
└── MenuPlanner.Tests/            # Unit and integration tests
```

### Frontend Structure
```
client/
├── src/
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Route-level page components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API client functions
│   ├── types/                    # TypeScript interfaces/types
│   └── utils/                    # Helper functions
├── tailwind.config.js
└── vite.config.ts
```

## Coding Conventions

### Backend (.NET)
- Use async/await throughout — all DB and AI calls must be async
- Constructor dependency injection (no service locator)
- Return DTOs from API endpoints, never domain entities directly
- Use FluentValidation for request validation
- Use Result pattern or exceptions for error handling (be consistent)
- XML doc comments on public API methods
- Follow .NET naming conventions (PascalCase for public, _camelCase for private fields)

### Frontend (React/TypeScript)
- Functional components only with hooks
- Named exports (no default exports)
- Define TypeScript interfaces for all API responses and component props
- Custom hooks for data fetching (e.g., useRecipes, useWeeklyMenu)
- Keep components small and focused
- Tailwind utility classes directly on elements — no CSS files

### General
- Keep commits focused and atomic
- Write unit tests for services and AI plugin logic
- Use meaningful variable and function names over comments

## Development Setup

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- PostgreSQL running locally (port 5432)
- AI API key configured in user secrets

### Database
- Connection string in appsettings.Development.json
- Use `dotnet ef migrations add <Name>` for schema changes
- Use `dotnet ef database update` to apply

### Running
- Backend: `dotnet run --project src/MenuPlanner.Api`
- Frontend: `cd client && npm run dev`
- API runs on https://localhost:5001, frontend on http://localhost:5173
- Configure CORS for local development
