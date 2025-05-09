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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(orderClient) {
        this.orderClient = orderClient;
    }
    async create(createOrderDto, req) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.orderClient.send('create_order', {
                userId: req.user.id,
                order: createOrderDto,
            }));
        }
        catch (error) {
            throw new Error('Failed to create order: ' + error.message);
        }
    }
    async findAll(req) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.orderClient.send('get_user_orders', { userId: req.user.id }));
        }
        catch (error) {
            throw new Error('Failed to fetch orders: ' + error.message);
        }
    }
    async findOne(id, req) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.orderClient.send('get_order', { id, userId: req.user.id }));
        }
        catch (error) {
            throw new Error('Failed to fetch order: ' + error.message);
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __param(0, (0, common_1.Inject)('ORDER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map