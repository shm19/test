import { IsString } from 'class-validator';

export class ChangeLanguageDto {
  @IsString()
  language: string;
}
