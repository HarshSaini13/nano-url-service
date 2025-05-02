# Environment Variables Configuration

This document explains how to configure environment variables for the NanoURL service.

## Frontend Environment Variables

The React frontend uses environment variables prefixed with `REACT_APP_` to configure various aspects of the application.

### Available Variables

| Variable            | Description               | Default |
| ------------------- | ------------------------- | ------- |
| `REACT_APP_API_URL` | Base URL for API requests | `/api`  |

### Setting Environment Variables

There are several ways to set environment variables for the React frontend:

#### 1. Using .env Files

Create React App supports different .env files for different environments:

- `.env`: Default for all environments
- `.env.development`: Used when running in development mode (`npm start`)
- `.env.production`: Used when building for production (`npm run build`)

Example `.env` file:

```
REACT_APP_API_URL=http://localhost:3001/api
```

#### 2. Using Docker Build Args

When building the Docker image, you can pass environment variables as build arguments:

```bash
docker build -t nano-url-frontend --build-arg REACT_APP_API_URL=http://api.example.com/api ./frontend
```

In docker-compose.yml:

```yaml
frontend:
  build:
    context: ./frontend
    args:
      - REACT_APP_API_URL=http://backend:3001/api
```

#### 3. Setting at Runtime (Not Recommended for React)

For React applications, environment variables are embedded during the build process. Setting them at runtime won't work unless you use a custom solution like runtime configuration injection.

### Docker Networking Considerations

When using Docker Compose, services can communicate with each other using their service names as hostnames. This means:

- For frontend running in Docker: Use `http://backend:3001/api` as the API URL
- For frontend running locally: Use `http://localhost:3001/api` as the API URL

## Backend Environment Variables

The Node.js backend uses environment variables for configuration.

### Available Variables

| Variable           | Description                          | Default                              |
| ------------------ | ------------------------------------ | ------------------------------------ |
| `PORT`             | Port to run the server on            | `3001`                               |
| `NODE_ENV`         | Environment (development/production) | `development`                        |
| `MONGODB_URI`      | MongoDB connection string            | `mongodb://localhost:27017/nano-url` |
| `REDIS_HOST`       | Redis host                           | `localhost`                          |
| `REDIS_PORT`       | Redis port                           | `6379`                               |
| `BASE_URL`         | Base URL for generated short links   | `http://localhost:3001`              |
| `SHORT_URL_LENGTH` | Length of generated short IDs        | `7`                                  |

### Setting Environment Variables

#### 1. Using .env File

Create a `.env` file in the backend directory:

```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nano-url
REDIS_HOST=localhost
REDIS_PORT=6379
BASE_URL=http://localhost:3001
SHORT_URL_LENGTH=7
```

#### 2. Using Docker Environment Variables

In docker-compose.yml:

```yaml
backend:
  environment:
    - PORT=3001
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongodb:27017/nano-url
    - REDIS_HOST=redis
    - REDIS_PORT=6379
    - BASE_URL=http://localhost:3001
```

Or using an env_file:

```yaml
backend:
  env_file:
    - ./backend/.env
```

#### 3. Setting at Runtime

For the backend, you can set environment variables at runtime:

```bash
PORT=4000 NODE_ENV=production node src/index.js
```

### Docker Networking Considerations

When using Docker Compose:

- Use `mongodb` as the hostname for MongoDB instead of `localhost`
- Use `redis` as the hostname for Redis instead of `localhost`
- For external access to the backend, use the mapped port on the host (e.g., `http://localhost:3001`)
- For internal communication between services, use the service name (e.g., `http://backend:3001`)

## Production Considerations

In production environments:

1. Never commit sensitive environment variables to version control
2. Consider using a secrets management solution for sensitive values
3. For the frontend, set environment variables during the build process
4. For the backend, use environment variables appropriate for your deployment platform (Docker, Kubernetes, etc.)
5. When deploying with Docker, ensure your network configuration allows services to communicate with each other
6. Consider using a reverse proxy (like Nginx) to handle routing between frontend and backend
