import { IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  passwordConfirm: string;
}
