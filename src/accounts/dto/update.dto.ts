// eslint-disable-next-line import/no-extraneous-dependencies
import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';

export class UpdateAccountDto extends PartialType(RegisterDto) {}
