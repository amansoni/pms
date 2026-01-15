# Mental Health Assessment App - Phase 4

## 1. Prepare Frontend (First Time Only)

```sh
cd frontend && npm install
```

## 2. Start Frontend

```sh
docker-compose up -d --build frontend
```

## 3. Login

- Open [http://localhost:3000](http://localhost:3000)
- You will be redirected to Keycloak for login.
- Login with:
  - Username: testuser@example.com
  - Password: Password123!

## 4. Test API Call

- On Dashboard, click "Test /api/users/me"
- Should show user info from backend

### If you get a 404 error:

- Make sure the backend service is running:  
  `docker-compose ps`
- Check backend logs for errors:  
  `docker logs backend`
- Confirm your backend exposes `/api/users/me` and includes the users router in `main.py`:
  ```python
  # app/main.py
  from app.api.routes import users
  app.include_router(users.router)
  ```
- Ensure your request is sent to `http://localhost:8000/api/users/me` and not `/users/me`.

### If you get a 404 error on `/api/admin/users`:

- The backend does not have the admin user management endpoints implemented or included.
- Make sure you have a route like `/api/admin/users` in your FastAPI backend.
- If not, you need to implement admin user management endpoints in your backend (see Phase 5/6 requirements).
- After adding the endpoints, restart the backend service:
  ```sh
  docker-compose restart backend
  ```
- Check backend logs for errors:  
  `docker logs backend`
- Confirm the route is registered by visiting `http://localhost:8000/docs` and looking for `/api/admin/users`.

### If you get a 401 Unauthorized on `/api/groups`:

- Your request is missing a valid Bearer token in the `Authorization` header.
- Make sure you are logged in via the frontend and your access token is sent with API requests.
- If testing with curl or Postman, obtain a token from Keycloak and include it:
  ```
  Authorization: Bearer <your-access-token>
  ```
- If using the frontend, ensure your session is active and the backend is configured to accept tokens from your Keycloak realm.
- Check backend logs for details:  
  `docker logs backend`
- Confirm your Keycloak client and realm settings match the backend configuration.

### If you get a 500 Internal Server Error on `/api/users/me`:

- This usually means the backend could not connect to Keycloak to verify your token.
- Make sure the Keycloak service is running and healthy:
  ```sh
  docker-compose ps
  ```
  Look for the `keycloak` service and ensure its status is "Up".
- If Keycloak is not running, start it:
  ```sh
  docker-compose up -d keycloak
  ```
- If you just started Keycloak, wait a few seconds for it to become ready.
- Check backend logs for connection errors:
  ```sh
  docker logs backend
  ```
- If running locally, ensure `KEYCLOAK_URL` in your backend environment matches the actual Keycloak URL and port.
- If using Docker, the backend should use the internal service name (e.g., `http://keycloak:8080`).

## 5. Stop and Clean Up

```sh
docker-compose down
docker-compose down -v
```
