# Mental Health Assessment App - Phase 1

## 1. Start PostgreSQL

```sh
docker-compose up -d postgres
```

## 2. Test the Connection

```sh
sh test-db.sh
```

You should see the PostgreSQL version output if the connection is successful.

## 3. Stop and Clean Up

To stop the database:

```sh
docker-compose down
```

To remove all data (persistent volume):

```sh
docker-compose down -v
```
