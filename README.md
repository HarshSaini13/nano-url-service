# NanoURL Service

A scalable, high-performance URL shortening service designed to handle millions of requests with low latency.

## Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **Analytics**: Track clicks and view statistics for your shortened URLs
- **API Access**: RESTful API for programmatic access
- **Scalable Architecture**: Designed to handle high traffic loads
- **Low Latency**: Fast response times through caching and efficient algorithms
- **High Availability**: Distributed architecture for reliability

## Architecture

This project is built with a microservices architecture for scalability and maintainability:

- **Frontend**: React.js single-page application
- **Backend API**: Node.js with Express
- **Database**: MongoDB with sharding capabilities
- **Caching**: Redis for fast URL lookups
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Docker Compose for local development, Kubernetes for production

## System Design

### High-Level Architecture

```
                                 ┌─────────────┐
                                 │   Load      │
                                 │  Balancer   │
                                 └──────┬──────┘
                                        │
                 ┌────────────────────┬─┴──┬────────────────────┐
                 │                    │    │                    │
          ┌──────▼──────┐     ┌──────▼──────┐           ┌──────▼──────┐
          │   API       │     │   API       │    ...    │   API       │
          │  Server 1   │     │  Server 2   │           │  Server n   │
          └──────┬──────┘     └──────┬──────┘           └──────┬──────┘
                 │                   │                          │
                 └───────────┬───────┴──────────────────┬──────┘
                             │                          │
                     ┌───────▼────────┐        ┌───────▼────────┐
                     │                │        │                │
                     │  Redis Cache   │        │   MongoDB      │
                     │                │        │  (Sharded)     │
                     └────────────────┘        └────────────────┘
```

### Scaling Strategies

1. **Horizontal Scaling**: Add more API servers behind a load balancer
2. **Database Sharding**: Partition data across multiple MongoDB instances
3. **Distributed Caching**: Redis cluster for caching frequently accessed URLs
4. **CDN Integration**: Serve static assets through a global CDN

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 16+ (for local development)
- MongoDB (for local development without Docker)
- Redis (for local development without Docker)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/nano-url-service.git
   cd nano-url-service
   ```

2. Start the services using Docker Compose:

   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

### Troubleshooting

If you encounter any issues with Docker builds, make sure:

1. Your Docker and Docker Compose are up to date
2. You have sufficient permissions to create Docker volumes
3. No other services are running on ports 80, 3001, 27017, or 6379

### Development Setup

#### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on the example:

   ```
   cp .env.example .env
   ```

4. Start the development server:
   ```
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Documentation

### Endpoints

#### Create Short URL

```
POST /api/url
```

Request body:

```json
{
  "originalUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
    "shortUrl": "http://localhost:3001/abc123",
    "shortId": "abc123",
    "createdAt": "2023-07-01T12:00:00.000Z"
  }
}
```

#### Get URL Statistics

```
GET /api/url/:shortId/stats
```

Response:

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
    "shortUrl": "http://localhost:3001/abc123",
    "shortId": "abc123",
    "clicks": 42,
    "createdAt": "2023-07-01T12:00:00.000Z"
  }
}
```

#### Redirect to Original URL

```
GET /:shortId
```

This endpoint redirects to the original URL associated with the provided short ID.

## Deployment

### Docker Deployment

The easiest way to deploy the application is using Docker Compose:

```
docker-compose up -d
```

For production environments, you might want to use a separate configuration:

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

For production environments, we recommend using Kubernetes:

1. Build and push Docker images to your registry
2. Apply Kubernetes manifests:
   ```
   kubectl apply -f k8s/
   ```

## Performance Considerations

- **Caching Strategy**: Frequently accessed URLs are cached in Redis
- **Database Indexing**: Optimized indexes for fast lookups
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Connection Pooling**: Efficient database connection management
- **Load Balancing**: Distributes traffic across multiple instances

## Security Considerations

- **Input Validation**: All user inputs are validated
- **Rate Limiting**: Prevents brute force attacks
- **HTTPS**: All communications are encrypted
- **XSS Protection**: Guards against cross-site scripting
- **CSRF Protection**: Prevents cross-site request forgery

## License

This project is licensed under the MIT License - see the LICENSE file for details.
