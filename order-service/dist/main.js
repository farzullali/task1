"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('OrderService');
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: ['amqp://guest:guest@localhost:5672'],
            queue: 'order_queue',
            queueOptions: {
                durable: false,
            },
        },
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    await app.listen();
    logger.log('Order Microservice is listening');
}
bootstrap();
//# sourceMappingURL=main.js.map