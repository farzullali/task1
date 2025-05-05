# Microservices Event-Based Architecture

This project demonstrates a microservices architecture using NestJS and RabbitMQ for event-based communication between services.

## Architecture Overview

The system consists of two main microservices:

1. **User Service**: Handles user registration, authentication, and user profile management
2. **Order Service**: Manages order creation and listing for authenticated users

Communication between services is implemented using RabbitMQ message broker, enabling event-driven architecture.

## Technologies Used

- **NestJS**: Framework for building scalable Node.js applications
- **TypeScript**: For type-safe code
- **PostgreSQL**: Database for User Service
- **Prisma**: ORM for Order Service
- **RabbitMQ**: Message broker for service communication
- **JWT**: Authentication mechanism
- **Docker**: Container platform for development

## Services

### User Service (Port 3001)

- User registration and login
- JWT token generation and validation
- User profile management
- Communicates with Order Service via RabbitMQ events

### Order Service (Port 3002)

- Create and list orders for authenticated users
- Uses Prisma ORM for database operations
- Receives user events from User Service

## Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL
- RabbitMQ

### Installation and Setup

1. **Clone the repository**

2. **Set up environment variables**
   - Create `.env` files in each service directory based on the provided templates

3. **Install dependencies**
   ```bash
   # In user-service directory
   cd user-service
   npm install

   # In order-service directory
   cd ../order-service
   npm install
   ```

4. **Start services**
   ```bash
   # Start User Service
   cd user-service
   npm run start:dev
   
   # Start Order Service in another terminal
   cd order-service
   npm run start:dev
   ```

5. **Access the services**
   - User Service: http://localhost:3001
   - Order Service: http://localhost:3002

## Development

### Database Migrations

For the Order Service (Prisma):
```bash
cd order-service
npx prisma migrate dev --name init
```

### API Endpoints

#### User Service
- POST /auth/register - Register a new user
- POST /auth/login - User login
- GET /users/profile - Get user profile (authenticated)

#### Order Service
- POST /orders - Create a new order (authenticated)
- GET /orders - List all orders for the authenticated user
- GET /orders/:id - Get a specific order

## Deployment

For production deployment, consider:
- Setting up proper environment variables
- Disabling database synchronize for TypeORM
- Using production-ready RabbitMQ settings with durable queues
- Implementing proper logging and monitoring 