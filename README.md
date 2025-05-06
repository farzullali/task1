# Full Message-Based Microservices Architecture

This project demonstrates a pure message-based microservices architecture using NestJS and RabbitMQ for all communication between services.

## Architecture Overview

The system consists of four main components:

1. **User Service**: Handles user management (registration, authentication)
2. **Order Service**: Manages order creation and listing
3. **API Gateway**: Acts as a facade for clients to interact with the microservices
4. **Frontend**: React-based user interface for interacting with the system

All inter-service communication happens exclusively through RabbitMQ message queues, implementing a true event-driven architecture.

## System Components and Ports

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3003
- **User Service**: Pure microservice (no HTTP port)
- **Order Service**: Pure microservice (no HTTP port)
- **PostgreSQL for User Service**: Port 5434
- **PostgreSQL for Order Service**: Port 5433
- **RabbitMQ**: Ports 5672 (AMQP), 15672 (Management UI)

## Quick Start

Follow these steps to get the project up and running quickly:

### 1. Start the Infrastructure

```bash
# Start PostgreSQL and RabbitMQ containers
docker-compose up -d
```

### 2. Install Dependencies

```bash
# Install dependencies for all services
npm run install:all
```

### 3. Start All Services

```bash
# Start all services at once (user-service, order-service, api-gateway, frontend)
npm run start:dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- API Gateway: http://localhost:3003
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## Manual Setup

If you prefer to set up and run each service individually:

### 1. Start Infrastructure

```bash
docker-compose up -d
```

### 2. User Service

```bash
cd user-service
npm install
npm run start:dev
```

### 3. Order Service

```bash
cd order-service
npm install
npm run start:dev
```

### 4. API Gateway

```bash
cd api-gateway
npm install --legacy-peer-deps
npm run start:dev
```

### 5. Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

All client requests go through the API Gateway:

- **Users API**:
  - `POST /users/register` - Register a new user
  - `POST /users/login` - User login
  - `GET /users/profile` - Get user profile

- **Orders API**:
  - `POST /orders` - Create a new order
  - `GET /orders` - List all orders for the authenticated user
  - `GET /orders/:id` - Get a specific order

## Authentication Flow

1. Register a user via `/users/register`
2. Login to get JWT token via `/users/login`
3. Include the JWT token in the Authorization header for protected endpoints
   - Format: `Authorization: Bearer YOUR_JWT_TOKEN`

### Testing Authentication

For testing purposes, you can use any valid JWT token in the Authorization header. The API Gateway includes a mock authentication guard that will accept any syntactically valid token.

Example:
```curl -X GET http://localhost:3003/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrVXNlcklkIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

### Error Handling

The system provides meaningful error messages for common scenarios:

- **Authentication Errors**:
  - Missing or invalid token format
  - User not found
  - Session expired

- **Business Logic Errors**:
  - Order not found
  - Invalid input data
  - Permission denied

All error responses follow a consistent format for easy handling in client applications.

## Project Structure

```
project-root/
├── api-gateway/        # API Gateway service
├── user-service/       # User management microservice
├── order-service/      # Order management microservice
├── frontend/           # React frontend
├── docker-compose.yml  # Docker services definition
└── package.json        # Root package with scripts
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors, ensure PostgreSQL is running:

```bash
docker ps | grep postgres
```

You can manually create databases if needed:

```bash
docker exec -it [postgres-container-id] psql -U postgres -c "CREATE DATABASE user_service;"
docker exec -it [postgres-container-id] psql -U postgres -c "CREATE DATABASE order_service;"
```

### RabbitMQ Connection Issues

Verify that RabbitMQ is running:

```bash
docker ps | grep rabbitmq
```

You can access the RabbitMQ management interface at http://localhost:15672 with credentials:
- Username: guest
- Password: guest

### Port Conflicts

If you encounter port conflicts, you can modify the ports in the respective .env files:
- Frontend: 3000 (package.json)
- API Gateway: 3003 (.env)
- PostgreSQL User Service: 5434 (docker-compose.yml)
- PostgreSQL Order Service: 5433 (docker-compose.yml)
- RabbitMQ: 5672, 15672 (docker-compose.yml)

## Technologies Used

- **NestJS**: Framework for building scalable Node.js applications
- **React**: Frontend library for building user interfaces
- **TypeScript**: For type-safe code
- **PostgreSQL**: Database for services
- **Prisma**: ORM for Order Service
- **TypeORM**: ORM for User Service
- **RabbitMQ**: Message broker for service communication
- **JWT**: Authentication mechanism
- **Docker**: Container platform for development
- **Tailwind CSS**: Utility-first CSS framework for the frontend

## Services Architecture

### API Gateway (Port 3000)

- Provides REST API endpoints for clients
- Routes requests to appropriate microservices through RabbitMQ
- Handles response transformation and error handling
- Serves as a unified entry point to the system

### User Service (Pure Microservice)

- Handles user-related operations (register, login, profile)
- Communicates exclusively via RabbitMQ messages
- No direct HTTP endpoints
- Uses PostgreSQL with TypeORM

### Order Service (Pure Microservice)

- Manages order operations (create, list, get)
- Communicates exclusively via RabbitMQ messages
- No direct HTTP endpoints
- Uses Prisma ORM for database access

## Communication Patterns

1. **Message Patterns (Request-Response)**:
   - API Gateway uses `send()` method for request-response communication with microservices
   - Each microservice handles these messages using `@MessagePattern()` decorators

2. **Event Patterns (Pub-Sub)**:
   - Services publish events using the `emit()` method
   - Other services listen for these events using `@EventPattern()` decorators
   - Used for asynchronous communication and event propagation

## Advantages of This Architecture

1. **True Decoupling**: Services communicate only through messages, not direct HTTP calls
2. **Resilience**: Services can operate independently, even if others are down
3. **Scalability**: Each service can be scaled independently based on demand
4. **Maintainability**: Services can be developed, deployed, and maintained separately
5. **Flexibility**: Easy to add or modify services without affecting the entire system

## Production Considerations

- Implement proper error handling and retry mechanisms
- Configure queue durability for message persistence
- Set up monitoring and logging for all services
- Consider using a message schema registry
- Implement circuit breakers for resilience 

## Prisma Database Troubleshooting

### Common Prisma Issues

1. **Table Does Not Exist Error**
   ```
   Invalid invocation: The table `public.TableName` does not exist in the current database
   ```
   **Solution:**
   ```bash
   # Sync your schema with the database
   npx prisma db push
   
   # Regenerate Prisma client
   npx prisma generate
   ```

2. **EPERM Errors on Windows**
   ```
   EPERM: operation not permitted, unlink 'node_modules\.prisma\client\...'
   ```
   **Solution:**
   - Close any applications that might be using Prisma client (VS Code, etc.)
   - Run PowerShell as administrator
   - Try `npx prisma generate --force`

3. **Schema Drift**
   ```
   The migration contains changes that were not properly applied
   ```
   **Solution:**
   ```bash
   # Reset the database (caution: this deletes all data)
   npx prisma migrate reset
   
   # Or create a new migration
   npx prisma migrate dev --name fix_schema
   ```

4. **Connection Issues**
   ```
   Error: P1001: Can't reach database server
   ```
   **Solution:**
   - Verify DATABASE_URL in .env file
   - Ensure PostgreSQL container is running
   - Check port mappings in docker-compose.yml

### Environment Setup

Ensure your .env file contains the correct database connection string:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/order_service"
```

### Order Service Database Startup Issues

If the order-service database fails to start or connect, follow these steps:

1. **Verify PostgreSQL Container Status**
   ```bash
   # Check if PostgreSQL container is running
   docker ps | grep postgres
   
   # If not running, start it
   docker-compose up -d postgres
   ```

2. **Check Database Existence**
   ```bash
   # Connect to PostgreSQL and list databases
   docker exec -it <postgres-container-id> psql -U postgres -c "\l"
   
   # If order_service database doesn't exist, create it
   docker exec -it <postgres-container-id> psql -U postgres -c "CREATE DATABASE order_service;"
   ```

3. **Verify Prisma Schema**
   ```bash
   # Check if the schema.prisma file is correctly configured
   cat order-service/prisma/schema.prisma
   ```

4. **Initialize Database Schema**
   ```bash
   cd order-service
   
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Check Environment Variables**
   ```bash
   # Ensure DATABASE_URL is correctly set in .env file
   cat order-service/.env
   
   # Example of correct format:
   # DATABASE_URL="postgresql://postgres:postgres@localhost:5433/order_service"
   ```

6. **Reset Prisma Client (for persistent issues)**
   ```bash
   # Delete node_modules/.prisma folder
   rm -rf node_modules/.prisma
   
   # Reinstall dependencies
   npm install
   
   # Regenerate Prisma client
   npx prisma generate
   ```

7. **Database Connection Timeout**
   If you're experiencing connection timeouts:
   ```bash
   # Check if PostgreSQL is accepting connections
   docker exec -it <postgres-container-id> psql -U postgres -c "SELECT 1;"
   
   # Restart the PostgreSQL container
   docker restart <postgres-container-id>
   ```

8. **Database Lock Issues**
   ```bash
   # Check for active connections that might be locking the database
   docker exec -it <postgres-container-id> psql -U postgres -c "SELECT * FROM pg_stat_activity WHERE datname = 'order_service';"
   
   # Terminate connections if necessary
   docker exec -it <postgres-container-id> psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'order_service';"
   ```

9. **Database Initialization Script**
   If all else fails, you can manually initialize the database with the Order table:
   ```bash
   docker exec -it <postgres-container-id> psql -U postgres -d order_service -c "
   CREATE TABLE IF NOT EXISTS \"Order\" (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     price FLOAT NOT NULL,
     \"userId\" TEXT NOT NULL,
     \"orderReference\" TEXT,
     \"createdAt\" TIMESTAMP NOT NULL DEFAULT NOW(),
     \"updatedAt\" TIMESTAMP NOT NULL
   );"
   ```

## Docker Troubleshooting

### Common Docker Issues

1. **Container Won't Start**
   ```
   Error response from daemon: driver failed programming external connectivity
   ```
   **Solution:**
   ```bash
   # Stop all containers and remove orphans
   docker-compose down --remove-orphans
   
   # Restart Docker Desktop (on Windows/Mac)
   # Then start containers again
   docker-compose up -d
   ```

2. **Port Conflicts**
   ```
   Error starting userland proxy: Bind for 0.0.0.0:5433: unexpected error
   ```
   **Solution:**
   - Check for applications using the same ports
   - Modify port mappings in docker-compose.yml
   - Kill processes using the ports:
     ```bash
     # Windows
     netstat -ano | findstr :5433
     taskkill /PID <PID> /F
     
     # Linux/Mac
     lsof -i :5433
     kill -9 <PID>
     ```

3. **Volume Mount Issues**
   ```
   Error: EACCES: permission denied
   ```
   **Solution:**
   - On Windows, ensure Docker has access to the drive
   - On Linux, check file permissions
   - Try using Docker volumes instead of bind mounts

4. **Database Initialization Failures**
   ```
   database system is starting up / shutting down
   ```
   **Solution:**
   ```bash
   # Check container logs
   docker logs <postgres-container-id>
   
   # Recreate the container
   docker-compose up -d --force-recreate postgres
   ```

5. **Out of Memory**
   ```
   Killed
   ```
   **Solution:**
   - Increase Docker memory allocation in Docker Desktop settings
   - Reduce services running simultaneously

### Docker Commands Reference

```bash
# View running containers
docker ps

# View container logs
docker logs <container-id>

# Restart a specific container
docker restart <container-id>

# Access PostgreSQL CLI
docker exec -it <postgres-container-id> psql -U postgres

# View Docker networks
docker network ls

# Inspect container details
docker inspect <container-id>
```

For persistent issues, try completely resetting Docker:
```bash
# Stop all containers
docker-compose down

# Remove all containers, networks, and volumes
docker system prune -a --volumes

# Restart Docker Desktop
# Then start containers again
docker-compose up -d
``` 