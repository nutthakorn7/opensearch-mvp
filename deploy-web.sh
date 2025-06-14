#!/bin/bash

# Build and start the containers
docker-compose -f docker-compose.web.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run database migrations
docker-compose -f docker-compose.web.yml exec nextjs-app npx prisma migrate deploy

echo "Deployment completed! Web application is running at http://localhost:3000" 