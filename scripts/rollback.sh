#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide a commit hash to rollback to"
    exit 1
fi

COMMIT_HASH=$1

echo "Rolling back to commit: $COMMIT_HASH"

# Checkout specific commit
git checkout $COMMIT_HASH

# Restart OpenSearch
echo "Restarting OpenSearch..."
docker-compose -f docker-compose.opensearch.yml down
docker-compose -f docker-compose.opensearch.yml up -d

# Wait for OpenSearch
echo "Waiting for OpenSearch to be ready..."
sleep 30

# Restart web application
echo "Restarting web application..."
docker-compose -f docker-compose.web.yml down
docker-compose -f docker-compose.web.yml up -d --build

echo "Rollback completed!" 