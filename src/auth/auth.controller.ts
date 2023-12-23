/* eslint-disable class-methods-use-this */
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Res,
  Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { HasRoles } from './roles.decorator';
import { RoleGuard } from './role.guard';
import { Role } from '../types/role.enum';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto, @Ip() ip) {
    return this.authService.login(data, ip);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Request() req, @Res() res) {
    res.redirect('/');
  }

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('admin')
  onlyAdmin() {
    return 'test from admin';
  }
}
