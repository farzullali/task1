import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { TokensService } from './tokens/tokens.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokensService: TokensService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTokensService = {
    generateTokens: jest.fn().mockResolvedValue({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    }),
    verifyAccessToken: jest.fn().mockResolvedValue({ 
      sub: 'user-id', 
      email: 'test@example.com' 
    }),
    verifyRefreshToken: jest.fn().mockResolvedValue({ 
      sub: 'user-id', 
      email: 'test@example.com' 
    }),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('test-token'),
    verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-id', email: 'test@example.com' }),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key, defaultValue) => defaultValue),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokensService, useValue: mockTokensService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw an error if email already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
      });

      await expect(service.register(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });

    it('should create a new user if email does not exist', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const newUser = {
        id: 'user-id',
        ...createUserDto,
      };
      
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newUser);
      
      const tokens = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      };

      // Mock the updateRefreshToken method
      jest.spyOn(service as any, 'updateRefreshToken').mockResolvedValue(undefined);
      
      expect(await service.register(createUserDto)).toEqual(tokens);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(tokensService.generateTokens).toHaveBeenCalledWith(newUser);
    });
  });
}); 