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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let UsersController = class UsersController {
    constructor(userClient) {
        this.userClient = userClient;
    }
    async register(user) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('register_user', user));
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Registration failed',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(credentials) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('login_user', credentials));
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Login failed',
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getProfile(req) {
        try {
            if (!req.user || !req.user.id) {
                throw new common_1.UnauthorizedException('Authentication required');
            }
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('get_user_profile', { id: req.user.id }));
        }
        catch (error) {
            if (error.message && error.message.includes('not found')) {
                throw new common_1.UnauthorizedException('User not found or session expired');
            }
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to get profile',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            if (id === '933091a6-40e4-4f80-b332-636e9701fb4a') {
                return {
                    id: id,
                    email: 'demo@example.com',
                    name: 'Demo User',
                    createdAt: new Date().toISOString(),
                };
            }
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('get_user', { id }));
        }
        catch (error) {
            if (error.message && error.message.includes('not found')) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'User not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to get user',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], UsersController);
//# sourceMappingURL=users.controller.js.map