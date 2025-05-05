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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let AuthController = class AuthController {
    constructor(userClient) {
        this.userClient = userClient;
    }
    async register(registerDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.userClient.send('register_user', registerDto));
            if (!result || !result.tokens) {
                throw new Error('Invalid response from auth service');
            }
            return result;
        }
        catch (error) {
            console.error('Registration error in API Gateway:', error);
            let message = 'Registration failed';
            let statusCode = common_1.HttpStatus.BAD_REQUEST;
            if (error.message) {
                message = error.message;
                if (error.message.includes('Email already exists')) {
                    message = 'Email already exists';
                }
            }
            throw new common_1.HttpException({
                status: 'error',
                message: message,
            }, statusCode);
        }
    }
    async login(loginDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.userClient.send('login_user', loginDto));
            if (!result || !result.tokens) {
                throw new Error('Invalid response from auth service');
            }
            return result;
        }
        catch (error) {
            console.error('Login error in API Gateway:', error);
            let message = 'Login failed';
            let statusCode = common_1.HttpStatus.UNAUTHORIZED;
            if (error.message) {
                message = error.message;
                if (error.message.includes('Invalid credentials')) {
                    message = 'Invalid email or password';
                }
            }
            throw new common_1.HttpException({
                status: 'error',
                message: message,
            }, statusCode);
        }
    }
    async logout(body) {
        try {
            if (body.refreshToken) {
                return await (0, rxjs_1.firstValueFrom)(this.userClient.send('logout_user', { refreshToken: body.refreshToken }));
            }
            return { success: true };
        }
        catch (error) {
            return { success: true };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], AuthController);
//# sourceMappingURL=auth.controller.js.map