"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const tokens_service_1 = require("./tokens/tokens.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, tokensService) {
        this.usersService = usersService;
        this.tokensService = tokensService;
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already exists');
        }
        const newUser = await this.usersService.create(createUserDto);
        const tokens = await this.getTokens(newUser);
        await this.updateRefreshToken(newUser.id, tokens.refresh_token);
        return {
            tokens,
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
            },
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        console.log(user);
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }
    async logout(userId) {
        await this.usersService.update(userId, { refreshToken: null });
        return true;
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async validateAccessToken(token) {
        try {
            return await this.tokensService.verifyAccessToken(token);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async getTokens(user) {
        return this.tokensService.generateTokens(user);
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        tokens_service_1.TokensService])
], AuthService);
//# sourceMappingURL=auth.service.js.map