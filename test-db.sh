#!/bin/sh

set -e

echo "Waiting for PostgreSQL to be healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' postgres)" = "healthy" ]; do
  sleep 2
done

echo "PostgreSQL is healthy. Testing connection..."
docker exec -e PGPASSWORD=securepass123 postgres psql -U dbuser -d mental_health_db -c "SELECT version();"
