# PowerShell script for development environment setup

Write-Host "Starting development environment setup for the microservices project..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker info > $null
} catch {
    Write-Host "Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit
}

# Create .env files if they don't exist
Write-Host "Creating .env files if they don't exist..." -ForegroundColor Yellow

if (-not (Test-Path -Path "./user-service/.env")) {
    Write-Host "Creating .env file for user-service..." -ForegroundColor Yellow
    $userServiceEnv = @"
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
"@
    Set-Content -Path "./user-service/.env" -Value $userServiceEnv
    Write-Host "Created .env file for user-service" -ForegroundColor Green
} else {
    Write-Host "User service .env file already exists" -ForegroundColor Green
}

if (-not (Test-Path -Path "./order-service/.env")) {
    Write-Host "Creating .env file for order-service..." -ForegroundColor Yellow
    $orderServiceEnv = @"
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/order_service

# User Service Configuration
USER_SERVICE_URL=http://localhost:3001

# Server Configuration
PORT=3002
NODE_ENV=development
"@
    Set-Content -Path "./order-service/.env" -Value $orderServiceEnv
    Write-Host "Created .env file for order-service" -ForegroundColor Green
} else {
    Write-Host "Order service .env file already exists" -ForegroundColor Green
}

# Start Docker containers
Write-Host "Starting PostgreSQL and RabbitMQ containers..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "Containers started successfully" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies for all services..." -ForegroundColor Yellow

Write-Host "Installing user-service dependencies..." -ForegroundColor Yellow
Set-Location -Path "./user-service"
npm install
Write-Host "User-service dependencies installed" -ForegroundColor Green

Write-Host "Installing order-service dependencies..." -ForegroundColor Yellow
Set-Location -Path "../order-service"
npm install
Write-Host "Order-service dependencies installed" -ForegroundColor Green

# Run Prisma migrations
Write-Host "Running Prisma migrations for order-service..." -ForegroundColor Yellow
npx prisma generate
npx prisma migrate dev --name init
Write-Host "Prisma migrations completed" -ForegroundColor Green

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "../frontend"
npm install
Write-Host "Frontend dependencies installed" -ForegroundColor Green

Set-Location -Path ".."

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "You can now start the services with the following commands:" -ForegroundColor Yellow
Write-Host "User Service: cd user-service && npm run start:dev" -ForegroundColor Green
Write-Host "Order Service: cd order-service && npm run start:dev" -ForegroundColor Green
Write-Host "Frontend: cd frontend && npm start" -ForegroundColor Green

Write-Host "Happy coding!" -ForegroundColor Yellow 