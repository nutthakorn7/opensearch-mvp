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
OPENSEARCH_URL=http://your-opensearch-server:9200
DATABASE_URL=postgresql://opensearch:opensearch@postgres:5432/opensearch
REDIS_URL=redis://redis:6379
POSTGRES_USER=opensearch
POSTGRES_PASSWORD=opensearch
POSTGRES_DB=opensearch
EOL

# Start the application
docker-compose -f docker-compose.web.yml up -d 