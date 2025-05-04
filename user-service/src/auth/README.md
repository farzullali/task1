# Authentication System

This module implements JWT-based authentication with access and refresh tokens.

## Overview

The authentication system uses the following components:

1. **TokensService** - Handles token generation and validation
2. **AuthService** - Manages user authentication logic
3. **JwtAuthGuard** - Protects routes requiring authentication
4. **JwtStrategy** - Configures Passport JWT strategy

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# JWT Configuration
JWT_ACCESS_SECRET=your_access_token_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Token System

- **Access Token** - Short-lived token for API access (15 minutes)
- **Refresh Token** - Long-lived token for obtaining new access tokens (7 days)
- Refresh tokens are stored hashed in the database
- Tokens can be revoked by removing the refresh token

## Security Considerations

- Refresh tokens are hashed using bcrypt
- Different secrets for access and refresh tokens
- Configurable expiration times
- Tokens can be invalidated on logout

## API Endpoints

- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Get access and refresh tokens
- `POST /auth/logout` - Revoke the refresh token
- `POST /auth/refresh` - Get a new access token using a refresh token
- `GET /auth/validate/:token` - Validate a token (used by other services) 