# Microservices Project: User and Order Services

This project consists of two separate microservices:

1. **User Service** - For user registration and authentication (Port: 3001)
2. **Order Service** - For order creation and listing (Port: 3002)

## Features

### User Service
- User registration
- Login with JWT
- Verification of incoming tokens
- Return user information based on userId

### Order Service
- Token validation via User Service
- Create orders (title, description, price)
- View user's own orders
- Stores order data in its own database

## Technologies

- NestJS
- TypeORM (User Service)
- Prisma (Order Service)
- PostgreSQL
- JWT
- RabbitMQ (via NestJS microservices module)
- Docker

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm

## Getting Started

1. Clone the repository
2. Start the databases and RabbitMQ with Docker:

```bash
docker-compose up -d
```

3. Install dependencies for both services:

```bash
# User Service
cd user-service
npm install

# Order Service
cd ../order-service
npm install
```

4. Set up Prisma for the Order Service:

```bash
cd order-service
npx prisma generate
npx prisma db push
```

5. Start both services:

```bash
# User Service
cd user-service
npm run start:dev

# Order Service (in another terminal)
cd order-service
npm run start:dev
```

## API Endpoints

### User Service (http://localhost:3001)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /users/:id` - Get user by ID (protected)

### Order Service (http://localhost:3002)

- `POST /orders` - Create a new order (protected)
- `GET /orders` - Get all orders of the current user (protected)

## Project Structure

```
.
├── docker-compose.yml
├── user-service/
│   ├── src/
│   │   ├── auth/       # Authentication logic
│   │   ├── users/      # User entity and service
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── guards/     # JWT auth guards
│   │   └── ...
│   └── ...
└── order-service/
    ├── src/
    │   ├── orders/     # Order entity and service
    │   ├── dto/        # Data Transfer Objects
    │   ├── guards/     # JWT auth guards
    │   └── ...
    └── ...
```

## Running Tests

```bash
# User Service
cd user-service
npm run test

# Order Service
cd order-service
npm run test
``` 