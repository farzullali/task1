# Microservices Project: User and Order Services with React Frontend

This project consists of two separate microservices and a React frontend:

1. **User Service** - For user registration and authentication (Port: 3001)
2. **Order Service** - For order creation and listing (Port: 3002)
3. **Frontend** - React application with authentication and order management (Port: 3000)

## Features

### User Service
- User registration
- Login with JWT
- Access token and refresh token functionality
- Verification of incoming tokens
- Return user information based on userId

### Order Service
- Token validation via User Service
- Create orders (title, description, price, optional reference)
- View user's own orders
- Stores order data in its own database

### Frontend
- User registration and login
- JWT authentication with access and refresh tokens
- Create and view orders
- Responsive design with Tailwind CSS

## Technologies

- NestJS for backend services
- React for frontend
- TypeORM (User Service)
- Prisma (Order Service)
- PostgreSQL
- JWT
- Tailwind CSS
- React Query
- React Router
- Framer Motion

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm

## Getting Started

1. Clone the repository
2. Use the setup script to initialize the development environment:

```bash
# On Linux/macOS
chmod +x dev-init.sh
./dev-init.sh

# On Windows PowerShell
./dev-init.ps1
```

Or manually set up the environment:

3. Start the databases and RabbitMQ with Docker:

```bash
docker-compose up -d
```

4. Install dependencies for all services:

```bash
# User Service
cd user-service
npm install

# Order Service
cd ../order-service
npm install

# Frontend
cd ../frontend
npm install
```

5. Set up the Order Service database with Prisma:

```bash
cd order-service
npx prisma generate
npx prisma migrate dev --name init
```

6. Start the services:

```bash
# User Service
cd user-service
npm run start:dev

# Order Service (in another terminal)
cd order-service
npm run start:dev

# Frontend (in another terminal)
cd frontend
npm start
```

7. Access the application:
   - Frontend: http://localhost:3000
   - User Service API: http://localhost:3001
   - Order Service API: http://localhost:3002

## API Endpoints

### User Service (http://localhost:3001)

- `GET /health` - Health check endpoint
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate refresh token)
- `GET /users/:id` - Get user by ID (protected)

### Order Service (http://localhost:3002)

- `GET /health` - Health check endpoint
- `POST /orders` - Create a new order (protected)
- `GET /orders` - Get all orders of the current user (protected)
- `GET /orders/:id` - Get a specific order by ID (protected)

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
├── order-service/
│   ├── src/
│   │   ├── orders/     # Order entity and service
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── guards/     # JWT auth guards
│   │   └── ...
│   └── ...
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── contexts/   # Context providers
    │   ├── hooks/      # Custom hooks
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   ├── types/      # TypeScript interfaces
    │   └── ...
    └── ...
```

## Important Configuration Notes

1. **CORS Configuration**: Both microservices have CORS enabled to allow requests from the frontend. The configuration is in the `main.ts` file of each service.

2. **Order Reference Field**: The Order service includes an optional `orderReference` field which can be set when creating orders.

3. **Authentication Flow**: The frontend uses access and refresh tokens for authentication. Access tokens are short-lived, while refresh tokens allow obtaining new access tokens without requiring the user to log in again.

4. **Environment Variables**: 
   - User Service: Configure database connection in `.env`
   - Order Service: Configure database connection and User Service URL in `.env`
   - Frontend: API URLs are configured in `src/services/api.ts`

## Running Tests

```bash
# User Service
cd user-service
npm run test

# Order Service
cd order-service
npm run test

# Frontend
cd frontend
npm test
```

## Troubleshooting

1. **Database Connection Issues**: Ensure PostgreSQL is running in Docker and the connection strings in `.env` files are correct.

2. **CORS Errors**: If you see CORS errors in the browser console, ensure both microservices have proper CORS configuration in `main.ts`.

3. **Prisma Issues**: If you update the Prisma schema, run `npx prisma migrate dev` to apply the changes to the database.

4. **Token Validation Errors**: Ensure User Service is running when using Order Service, as it depends on it for token validation.

5. **Setup Script Issues**: If you encounter issues with the setup scripts, you can follow the manual setup steps in the Getting Started section. 