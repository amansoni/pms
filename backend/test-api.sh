#!/bin/sh

set -e

echo "Testing /api/health endpoint..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/health

echo "Testing /api/users/me endpoint without token (should be 401)..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/users/me
