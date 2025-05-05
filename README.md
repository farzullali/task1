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
```
curl -X GET http://localhost:3003/users/profile \
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