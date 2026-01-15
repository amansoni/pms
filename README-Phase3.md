# Mental Health Assessment App - Phase 3

## 1. Start All Services

```sh
docker-compose up -d postgres keycloak backend
```

## 2. Test Backend API

Run:

```sh
sh backend/test-api.sh
```

- Should return `200` for `/api/health`
- Should return `401` for `/api/users/me` without token

## 3. Test JWT Authentication

1. Obtain a JWT token from Keycloak (use client `assessment-app`).
2. Call `/api/users/me` with header: `Authorization: Bearer <token>`.
3. Should return user info.

## 4. Stop and Clean Up

```sh
docker-compose down
docker-compose down -v
```
