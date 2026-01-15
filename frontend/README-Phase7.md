# Mental Health Assessment App - Phase 7: Admin Panel

## Accessing Admin Panel

- Login as a user with the `admin` role in Keycloak.
- Click "Admin" in the navigation bar.
- Access "Manage Users" and "Manage Groups" from the dropdown.

## Screenshots

- ![User Management](screenshots/user-management.png)
- ![Group Management](screenshots/group-management.png)

## API Endpoints

- `/api/admin/users`
- `/api/groups`
- `/api/groups/{group_id}/settings`
- `/api/groups/{group_id}/members`

## Troubleshooting

- If you see "Access Denied", ensure your Keycloak user has the `admin` role.
- For API errors, check backend logs and Keycloak group/role mappings.

## Styling

- Blue primary: #3B82F6
- Red for delete: #EF4444
- Green for success: #10B981
- All UI uses Tailwind utility classes.
- Dark mode supported via `dark:` variants.
