import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';

export class CreateSignalTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;

  @IsISO8601()
  @IsNotEmpty()
  readonly time: Date;
}
