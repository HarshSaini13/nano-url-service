# NanoURL Frontend

This is the frontend application for the NanoURL service, built with React.

## Environment Variables

The frontend application uses environment variables to configure various aspects of the application. These environment variables are embedded during the build process.

### REACT_APP_API_URL

The `REACT_APP_API_URL` environment variable is used to configure the base URL for API requests in the `urlService.js` file:

```javascript
// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### Configuration Options

1. **Local Development (outside Docker)**:

   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

2. **Docker Development/Production**:

   ```
   REACT_APP_API_URL=http://backend:3001/api
   ```

   When using Docker Compose, services can communicate with each other using their service names as hostnames.

3. **Production (same domain)**:

   ```
   REACT_APP_API_URL=/api
   ```

   This uses a relative path, which works when the frontend and backend are served from the same domain.

4. **Production (separate domain)**:
   ```
   REACT_APP_API_URL=https://api.example.com/api
   ```
   Use this when your API is hosted on a different domain.

### Setting Environment Variables

#### Method 1: Using .env Files

Create React App supports different .env files for different environments:

1. Create a `.env` file in the frontend directory:

   ```
   REACT_APP_API_URL=http://backend:3001/api
   ```

2. For environment-specific configuration, use:
   - `.env.development` - Used during development (`npm start`)
   - `.env.production` - Used during production build (`npm run build`)

#### Method 2: Using Docker Build Args

When building with Docker, you can pass environment variables as build arguments:

```bash
# Building directly
docker build -t nano-url-frontend --build-arg REACT_APP_API_URL=http://backend:3001/api ./frontend

# Using docker-compose
# In docker-compose.yml:
frontend:
  build:
    context: ./frontend
    args:
      - REACT_APP_API_URL=http://backend:3001/api
```

## Docker Networking

When using Docker Compose, services are connected to the same network and can communicate with each other using their service names as hostnames. This is why we use `http://backend:3001/api` instead of `http://localhost:3001/api` in the Docker environment.

If you're running the frontend outside of Docker but the backend inside Docker, you'll need to use `http://localhost:3001/api` (assuming you've mapped port 3001 from the container to the host).

## Development

To start the development server:

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Building for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Docker

To build and run the frontend using Docker:

```bash
# Build the image
docker build -t nano-url-frontend .

# Run the container
docker run -p 80:80 nano-url-frontend
```

Or using docker-compose:

```bash
docker-compose up -d frontend
```

## Troubleshooting

### Connection Refused Errors

If you see "ECONNREFUSED" errors, it usually means:

1. The backend service is not running
2. The frontend is trying to connect to the wrong hostname/port
3. There's a network configuration issue

Check:

- If running with Docker Compose, make sure you're using `http://backend:3001/api` as the API URL
- If running locally, make sure you're using `http://localhost:3001/api` and the backend is running
- Check that the ports are correctly mapped in docker-compose.yml
