# react-native-chat

A full-stack Discord-like application with real-time messaging capabilities, built with Node.js/TypeScript backend and React Native frontend.

## Project Structure

```
discord-native/
├── backend/              # Express.js + TypeScript API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── db/          # Database operations
│   │   ├── routers/     # API routes & WebSocket routes
│   │   ├── middleware/  # Auth & validation middleware
│   │   └── cryptography/# JWT & encryption utilities
│   ├── build/           # Compiled JavaScript output
│   ├── Dockerfile       # Docker image definition
│   └── package.json
│
└── my-app/              # React Native/Expo frontend
    ├── api/             # API client functions
    ├── components/      # UI components
    ├── storage/         # Local storage utilities
    └── package.json
```

## Prerequisites

- **Docker** and **Docker Compose** (for containerized deployment)
- **Node.js 20+** (for local development)
- **npm** 10+
- **MySQL 8.0+** (if running locally without Docker)

## Quick Start with Docker

### 1. Clone/Navigate to Project

````markdown
# react-native-chat

A full-stack Discord-like application with real-time messaging capabilities, built with Node.js/TypeScript backend and React Native frontend.

## Project Structure

```
discord-native/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── routers/
│   │   ├── middleware/
│   │   └── cryptography/
│   ├── build/
│   ├── Dockerfile
│   └── package.json
│
└── my-app/
  ├── api/
  ├── components/
  ├── storage/
  └── package.json
```
docker-compose build --no-cache backend
docker-compose up -d
```

### 4. Verify Deployment

Check if services are running:

```bash
docker-compose ps
```

View backend logs:

```bash
docker-compose logs -f backend
```

View MySQL logs:

```bash
docker-compose logs -f mysql
```

### 5. Access Services

- **Backend API**: `http://localhost:3000`
- **MySQL Database**: `localhost:3307` (host port for external connections)
  - User: `discord_user` (or `root`)
  - Password: value from `.env`

## Running Locally (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the server
npm start
```

The backend will run on `http://localhost:3000`.

**Note**: You'll need MySQL running locally. Update the `DB_HOST` environment variable or configure connection details in `backend/src/db/pool.ts`.

### Frontend Setup

```bash
cd my-app

npm install


npm start

```

## Available Scripts

### Backend

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled backend server
- `npm test` - Run tests (currently a placeholder)

### Frontend

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DB_HOST` | MySQL hostname | `mysql` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `discord_user` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | Database name | `discord_db` |

## Docker Compose Services

### Backend Service
- **Container**: `discord-backend`
- **Port**: `3000:3000`
- **Image**: Built from `backend/Dockerfile`
- **Dependencies**: MySQL

### MySQL Service
- **Container**: `discord-mysql`
- **Port**: `3307:3306` (host:container)
- **Image**: `mysql:8.0`
- **Volume**: `mysql_data` (persistent data storage)
- **Root Password**: From `DB_PASSWORD` env var

## Stopping Services

```bash
docker-compose down
```

To also remove persistent data:

```bash
docker-compose down -v
```

## Troubleshooting

### Port 3306 Already in Use

If MySQL fails with "port already in use" error:

**Option 1**: Use different host port in `docker-compose.yml`
```yaml
ports:
  - "3307:3306"  # Already configured
```

**Option 2**: Free the port (Windows PowerShell, admin required)
```powershell
netstat -aon | findstr :3306
Stop-Process -Id <PID> -Force
```

### Build Fails: Missing `node-pre-gyp`

The Dockerfile automatically installs build tools for native modules (`wrtc`). If issues persist:

```bash
docker-compose build --no-cache backend
```

### TypeScript Compilation Errors

Ensure `tsconfig.json` is present in the `backend/` directory. Current build uses:

```bash
npm run build  # runs: tsc
```

### MySQL Connection Refused

Verify environment variables in `.env` match `docker-compose.yml`:
- Inside container: `DB_HOST=mysql`, `DB_PORT=3306`
- From host machine: `localhost:3307`

## Project Features

- **Real-time Messaging**: WebSocket support for instant messaging
- **User Authentication**: JWT-based authentication
- **Server Management**: Create and manage Discord-like servers
- **Group Chats**: Support for multiple chat rooms
- **File Handling**: Image and media support with `sharp` and `fluent-ffmpeg`
- **Cryptography**: Secure password hashing and JWT tokens
- **Database**: MySQL with connection pooling via `mysql2`

## Technology Stack

### Backend
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Server**: Express.js
- **Database**: MySQL 8.0
- **Real-time**: WebSocket (ws library)
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod

### Frontend
- **Framework**: React Native / Expo
- **Language**: TypeScript
- **Navigation**: React Navigation Stack
- **Styling**: CSS-in-JS with custom styles
- **Storage**: Expo Secure Store

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Servers
- `GET /get/servers` - Get user's servers
- `POST /add/server` - Create new server
- `DELETE /delete/server` - Delete server

### Messages
- `GET /get/messages` - Get server messages
- `POST /add/message` - Send message (WebSocket)
- `DELETE /delete/message` - Delete message (WebSocket)

### WebSocket Events
- `add` - Add message or user
- `delete` - Remove message or user
- `update` - Update user status

## Development Notes

- **Deprecated Packages**: `fluent-ffmpeg` is marked as unmaintained. Consider alternatives for production.
- **Build Output**: TypeScript compiles to `backend/build/` directory. Do not modify directly.
- **Volume Mounts**: Production Docker image does not mount source files to prevent `node_modules` conflicts with native modules.

## Contributing

1. Create feature branch
2. Make changes
3. Build and test locally
4. Submit pull request

## License

ISC

## Support

For issues or questions:
1. Check Docker logs: `docker-compose logs backend`
2. Verify `.env` configuration
3. Ensure MySQL is running: `docker-compose ps`
````