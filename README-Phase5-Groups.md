# Mental Health Assessment App - Phase 5: Group Management

## 1. Create Groups in Keycloak

- Login to Keycloak admin console
- Go to "Groups" and create new groups

## 2. Set Group Attributes

- In Keycloak, select a group and add attributes

## 3. Configure Group Membership Mapper

- In "Clients" > "assessment-app", add a group membership mapper to include 'groups' claim in tokens

## 4. API Endpoints

- `GET /api/groups` — List groups for current user
- `GET /api/groups/{group_id}` — Get group details and attributes
- `GET /api/groups/{group_id}/members` — List group members
- `PATCH /api/groups/{group_id}/settings` — Update group settings (admin only)
- `POST /api/groups/{group_id}/members` — Add user to group (admin only)
- `DELETE /api/groups/{group_id}/members/{user_id}` — Remove user (admin only)

## 5. UI Components

- GroupList: shows all groups user can access
- GroupSettings: editable for admins
- GroupMembers: manage members

## 6. Audit Logging

- All group management actions are logged as audit events

## 7. Stop and Clean Up

```sh
docker-compose down
docker-compose down -v
```
