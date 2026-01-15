# Mental Health Assessment App - Phase 2

## 1. Start PostgreSQL and Keycloak

```sh
docker-compose up -d postgres keycloak
```

## 2. Enable CORS for Keycloak (Development Only)

To allow frontend access, set CORS origins in Keycloak:

1. Open Keycloak admin console: [http://localhost:8080](http://localhost:8080)
2. Login with:
   - Username: admin
   - Password: admin123
3. Go to your realm ("mental-health-realm").
4. Go to "Clients" > "assessment-app".
5. Set "Web Origins" to:
   ```
   http://localhost:3000
   http://localhost:5173
   ```
6. Save changes.

## 3. Import Realm Configuration

After Keycloak starts, import the realm:

1. Open Keycloak admin console: [http://localhost:8080](http://localhost:8080)
2. Login with:
   - Username: admin
   - Password: admin123
3. Go to "Realm Settings" > "Import" and upload `keycloak/realm-export.json`.

## 4. Test Keycloak Setup

Follow the checklist in `KEYCLOAK-TEST.md` to verify realm, client, roles, and test user.

## 5. Stop and Clean Up

To stop all services:

```sh
docker-compose down
```

To remove all data (persistent volumes):

```sh
docker-compose down -v
```

## Example API Response

When you call `/api/users/me`, you should see a response like:

```json
{
  "email": "testuser@example.com",
  "sub": "6114a4fa-c27f-4b85-887b-2b4106871cba",
  "roles": [
    "clinician",
    "admin"
  ]
}
```
