#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development environment setup for the microservices project...${NC}"

# Check if Docker is running
echo -e "${YELLOW}Checking if Docker is running...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Create .env files if they don't exist
echo -e "${YELLOW}Creating .env files if they don't exist...${NC}"

if [ ! -f "./user-service/.env" ]; then
  echo -e "${YELLOW}Creating .env file for user-service...${NC}"
  cat > ./user-service/.env << EOL
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
EOL
  echo -e "${GREEN}Created .env file for user-service${NC}"
else
  echo -e "${GREEN}User service .env file already exists${NC}"
fi

if [ ! -f "./order-service/.env" ]; then
  echo -e "${YELLOW}Creating .env file for order-service...${NC}"
  cat > ./order-service/.env << EOL
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/order_service

# User Service Configuration
USER_SERVICE_URL=http://localhost:3001

# Server Configuration
PORT=3002
NODE_ENV=development
EOL
  echo -e "${GREEN}Created .env file for order-service${NC}"
else
  echo -e "${GREEN}Order service .env file already exists${NC}"
fi

# Start Docker containers
echo -e "${YELLOW}Starting PostgreSQL and RabbitMQ containers...${NC}"
docker-compose up -d
echo -e "${GREEN}Containers started successfully${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies for all services...${NC}"

echo -e "${YELLOW}Installing user-service dependencies...${NC}"
cd user-service && npm install
echo -e "${GREEN}User-service dependencies installed${NC}"

echo -e "${YELLOW}Installing order-service dependencies...${NC}"
cd ../order-service && npm install
echo -e "${GREEN}Order-service dependencies installed${NC}"

# Run Prisma migrations
echo -e "${YELLOW}Running Prisma migrations for order-service...${NC}"
cd ../order-service && npx prisma generate && npx prisma migrate dev --name init
echo -e "${GREEN}Prisma migrations completed${NC}"

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd ../frontend && npm install
echo -e "${GREEN}Frontend dependencies installed${NC}"

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}You can now start the services with the following commands:${NC}"
echo -e "${GREEN}User Service:${NC} cd user-service && npm run start:dev"
echo -e "${GREEN}Order Service:${NC} cd order-service && npm run start:dev"
echo -e "${GREEN}Frontend:${NC} cd frontend && npm start"

echo -e "${YELLOW}Happy coding!${NC}" 