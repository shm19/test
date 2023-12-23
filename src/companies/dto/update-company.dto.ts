// eslint-disable-next-line import/no-extraneous-dependencies
import { PartialType } from '@nestjs/mapped-types';
import { AddCompanyDto } from './add-company.dto';

export class UpdateCompanyDto extends PartialType(AddCompanyDto) {}
