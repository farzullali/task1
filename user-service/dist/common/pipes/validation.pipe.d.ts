import { ValidationPipe } from '@nestjs/common';
export declare class CustomValidationPipe extends ValidationPipe {
    constructor(options?: {});
    private formatErrors;
}
