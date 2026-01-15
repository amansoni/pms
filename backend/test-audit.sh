#!/bin/sh

set -e

echo "Testing /api/health endpoint..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/health

echo "Get admin token from Keycloak..."
TOKEN=$(curl -s \
  -d "client_id=assessment-app" \
  -d "username=testuser@example.com" \
  -d "password=Password123!" \
  -d "grant_type=password" \
  -d "scope=openid" \
  http://localhost:8080/realms/mental-health-realm/protocol/openid-connect/token | jq -r .access_token)

echo "Query audit logs endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:8000/api/audit-logs?limit=5"
