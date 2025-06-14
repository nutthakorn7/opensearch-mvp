#!/bin/bash

# Create application directory
sudo mkdir -p /opt/opensearch-mvp
sudo chown $USER:$USER /opt/opensearch-mvp

# Clone repository
cd /opt/opensearch-mvp
git clone https://github.com/YOUR_USERNAME/opensearch-mvp.git .

# Create .env file
cat > .env << EOL
JWT_SECRET=your-secure-secret
OPENSEARCH_URL=http://localhost:9200
DATABASE_URL=postgresql://opensearch:opensearch@postgres:5432/opensearch
REDIS_URL=redis://redis:6379
POSTGRES_USER=opensearch
POSTGRES_PASSWORD=opensearch
POSTGRES_DB=opensearch
EOL

# Start OpenSearch first
echo "Starting OpenSearch..."
docker-compose -f docker-compose.opensearch.yml up -d

# Wait for OpenSearch to be ready
echo "Waiting for OpenSearch to be ready..."
sleep 30

# Start web application
echo "Starting web application..."
docker-compose -f docker-compose.web.yml up -d

echo "Setup completed! Services are running at:"
echo "OpenSearch: http://localhost:9200"
echo "Web Application: http://localhost:3000" 