# Show Me The Menu

A .NET 8 Web API backend with a React TypeScript (Vite) frontend.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v20+)

## Development

Start both services in separate terminals:

### API (backend)

```bash
cd api
dotnet run
```

Runs on http://localhost:5000 (Swagger UI at http://localhost:5000/swagger).

### Client (frontend)

```bash
cd client
npm install   # first time only
npm run dev
```

Runs on http://localhost:5173. API calls to `/api/*` are proxied to the .NET backend.

## Project Structure

```
show-me-the-menu/
├── ShowMeTheMenu.sln          # .NET solution file
├── api/                       # .NET 8 Web API
│   ├── Program.cs
│   ├── ShowMeTheMenu.Api.csproj
│   └── Properties/launchSettings.json
├── client/                    # React TypeScript (Vite)
│   ├── src/App.tsx
│   ├── vite.config.ts
│   └── package.json
└── README.md
```
