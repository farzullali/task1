# JWT Authentication in Order Service

This module implements token validation for the Order Service by communicating with the User Service.

## Overview

The JWT authentication in the Order Service relies on the User Service for token validation. This ensures:

1. Consistent authentication across services
2. Centralized token management
3. Service-to-service authentication

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# User Service Configuration
USER_SERVICE_URL=http://localhost:3001
```

## Authentication Flow

1. Client sends a request to Order Service with an access token
2. Order Service extracts the token from the request header
3. Order Service calls User Service to validate the token
4. If valid, User Service returns the token payload
5. Order Service adds the user information to the request object
6. Protected routes can access the user information from the request

## Security Considerations

- Only the User Service has access to the JWT secrets
- Token validation happens via authenticated API calls
- User Service handles token refresh and expiration

## Implementation Details

- `JwtAuthGuard` - Guards protected routes and validates tokens with User Service
- HTTP requests to User Service validate tokens without exposing secrets

## Usage

```typescript
@UseGuards(JwtAuthGuard)
@Get()
async getOrders(@Req() req) {
  // req.user contains the validated user information
  return this.ordersService.findAllByUser(req.user.sub);
}
``` 