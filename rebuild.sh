#!/bin/bash

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down

# Rebuild the images
echo "Rebuilding images..."
docker-compose build

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Show container status
echo "Container status:"
docker-compose ps

# Show logs from the backend
echo "Backend logs:"
docker-compose logs backend

echo "Done! The application should now be running at:"
echo "- Frontend: http://localhost"
echo "- Backend API: http://localhost:3001/api"