# Environment Setup Guide

This guide provides instructions for setting up the environment files for both the User Service and Order Service.

## User Service Environment Setup (.env)

Create a file named `.env` in the `user-service` directory with the following configuration:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_service

# JWT Configuration
JWT_ACCESS_SECRET=access_secret_key
JWT_REFRESH_SECRET=refresh_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Environment Variables Explanation:

- **Database Configuration**:
  - `DB_HOST`: PostgreSQL database host
  - `DB_PORT`: PostgreSQL database port
  - `DB_USERNAME`: PostgreSQL username
  - `DB_PASSWORD`: PostgreSQL password
  - `DB_DATABASE`: Database name for the user service

- **JWT Configuration**:
  - `JWT_ACCESS_SECRET`: Secret key for signing access tokens
  - `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens
  - `JWT_ACCESS_EXPIRES_IN`: Access token expiration time
  - `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time

- **Server Configuration**:
  - `PORT`: Port on which the user service will run
  - `NODE_ENV`: Environment mode (development, production, etc.)

## Order Service Environment Setup (.env)

Create a file named `.env` in the `order-service` directory with the following configuration:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/order_service

# User Service Configuration
USER_SERVICE_URL=http://localhost:3001

# Server Configuration
PORT=3002
NODE_ENV=development
```

### Environment Variables Explanation:

- **Database Configuration**:
  - `DATABASE_URL`: PostgreSQL connection string for Prisma

- **User Service Configuration**:
  - `USER_SERVICE_URL`: URL of the User Service for token validation

- **Server Configuration**:
  - `PORT`: Port on which the order service will run
  - `NODE_ENV`: Environment mode (development, production, etc.)

## Important Notes

1. **Security**: In a production environment, use strong, unique secrets for JWT tokens.
2. **Database Ports**: The example uses ports 5432 for User Service and 5433 for Order Service. Adjust these according to your Docker configuration.
3. **Docker Configuration**: The database connection parameters should match those defined in your `docker-compose.yml` file.
4. **Environment Variables**: The services use defaults for most values if not specified, but it's best practice to explicitly define all required variables.

## Setting Up Databases

After creating the `.env` files, set up the databases:

### User Service (TypeORM)
The database schema will be automatically created when starting the service if `synchronize` is set to `true` (recommended only for development).

### Order Service (Prisma)
Run the following commands to set up the database:

```bash
cd order-service
npx prisma generate
npx prisma migrate dev --name init
```

This will create all the necessary tables based on the schema defined in `prisma/schema.prisma`. 