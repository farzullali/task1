import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-id', email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
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

      expect(await service.register(createUserDto)).toEqual(newUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
}); 