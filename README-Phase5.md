# Mental Health Assessment App - Phase 5

## 1. Start All Services

```sh
docker-compose up -d --build
```

## 2. Test Audit Logging

Run:

```sh
sh backend/test-audit.sh
```

- Should return 200 for `/api/health`
- Should show recent audit log entries for API access

### If you get a 500 Internal Server Error:

- Check backend logs for details:  
  `docker logs backend`
- Make sure your audit middleware checks for a valid JWT before calling `verify_token`:
  ```python
  # Only verify if token.count('.') == 2
  ```
- Ensure the backend database is running and migrations/tables are created.
- Confirm your token is valid and not empty in the test script.

## 3. Manual Audit Log Query

- Login as admin user at `http://localhost:3000/login`
To get your token value:

- After logging in at `http://localhost:3000/login`, open your browser's developer tools.
- Go to the "Network" tab and find the login request.
- In the response, look for a field named `token` or `access_token`.
- Copy this token and use it in your API requests (e.g., as a Bearer token in the Authorization header).
- Filter by user_id or event_type if needed
- Filter by user_id or event_type if needed

## 4. Stop and Clean Up

```sh
docker-compose down
docker-compose down -v
```
