# Test Plan: Phase 5 – Audit Logging

## 1. Environment Setup
- Start all services:
  ```sh
  docker-compose up -d --build
  ```
- Ensure backend, frontend, and Keycloak containers are running.

## 2. Automated Audit Logging Test
- Run the test script:
  ```sh
  sh backend/test-audit.sh
  ```
  - Verify `/api/health` returns HTTP 200.
  - Verify the script outputs recent audit log entries for API access.

## 3. Manual Audit Log Query
- Login as admin at `http://localhost:3000/login`.
- Obtain a valid access token from browser dev tools.
- Make an authenticated GET request to `/api/audit-logs` with the token:
  - Confirm logs are returned.
  - Test filtering by `user_id` and `event_type`.

## 4. Error Handling
- Stop backend or database, then run the test script:
  - Confirm a 500 error is returned.
  - Check backend logs for error details.
- Use an invalid or empty token in the test script:
  - Confirm access is denied or error is returned.

## 5. Middleware & Database Checks
- Confirm audit middleware only calls `verify_token` if `token.count('.') == 2`.
- Ensure audit log table exists and is populated after API access.

## 6. Cleanup
- Run:
  ```sh
  docker-compose down
  docker-compose down -v
  ```
- Confirm all containers and volumes are removed.
