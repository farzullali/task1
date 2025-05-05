"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('ApiGateway');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3003'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type,Accept,Authorization',
    });
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    logger.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map