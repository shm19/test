import { IsOptional, IsString } from 'class-validator';

export class EmailOptionsDto {
  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  html: string;

  @IsOptional()
  from: object;

  @IsString()
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsOptional()
  attachments: object;
}
