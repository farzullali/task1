import { ArgumentMetadata, BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(options = {}) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      ...options,
      exceptionFactory: (errors) => {
        const result = this.formatErrors(errors);
        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Failed',
          validationErrors: result,
        });
      },
    });
  }

  private formatErrors(errors: any[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    errors.forEach((error) => {
      const property = error.property;
      const constraints = Object.values(error.constraints || {}) as string[];
      
      if (!result[property]) {
        result[property] = [];
      }
      
      result[property].push(...constraints);
    });
    
    return result;
  }
} 