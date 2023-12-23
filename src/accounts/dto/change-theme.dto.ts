import { IsString } from 'class-validator';

export class ChangeThemeDto {
  @IsString()
  theme: string;
}
