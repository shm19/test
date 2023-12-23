import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ValidationError, ValidatorOptions, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MyLoggerService } from 'src/logger/myLogger.service';
import mongoose from 'mongoose';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  constructor(
    private readonly logger: MyLoggerService,
    private readonly options?: ValidatorOptions,
  ) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (
      !metatype ||
      !this.toValidate(metatype) ||
      mongoose.isValidObjectId(value)
    ) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const validationErrors = this.buildErrorMessages(errors);
      this.logger.error(`Validation errors: ${validationErrors}`);
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private buildErrorMessages(errors: ValidationError[]): string {
    return errors
      .flatMap((error) => Object.values(error.constraints || {}))
      .join(', ');
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
