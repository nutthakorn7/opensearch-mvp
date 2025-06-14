#!/bin/bash

echo "=== Checking OpenSearch Status ==="
curl -s http://localhost:9200/_cluster/health | jq '.'

echo -e "\n=== Checking Docker Containers ==="
docker ps

echo -e "\n=== Checking OpenSearch Logs ==="
docker-compose -f docker-compose.opensearch.yml logs --tail=20

echo -e "\n=== Checking Web Application Logs ==="
docker-compose -f docker-compose.web.yml logs --tail=20

echo -e "\n=== Checking Disk Usage ==="
df -h /opt/opensearch-mvp 