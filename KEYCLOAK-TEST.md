# Keycloak Browser Test Checklist

1. Access Keycloak admin console: [http://localhost:8080](http://localhost:8080)
2. Login with:
   - Username: admin
   - Password: admin123
3. Verify realm "mental-health-realm" exists.
4. Verify client "assessment-app" exists.
5. Verify roles: clinician, admin, auditor exist.
6. Verify user "testuser@example.com" exists and has "clinician" role.
7. Test login as "testuser@example.com" with password "Password123!".
