import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Patch,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../types/role.enum';
import { AccountsService } from './accounts.service';
import { ChangeThemeDto } from './dto/change-theme.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { UpdateAccountDto } from './dto/update.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('change-theme')
  changeTheme(@Body() data: ChangeThemeDto, @Request() req) {
    return this.accountService.changeTheme(req.user.userId, data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('change-language')
  changeLanguage(@Body() data: ChangeLanguageDto, @Request() req) {
    return this.accountService.changeLanguage(req.user.userId, data);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('delete-account')
  deleteAccount(@Body() id: string) {
    return this.accountService.deleteAccount(id);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch('update-password')
  updatePassword(@Body() data: UpdatePasswordDto, @Request() req) {
    return this.accountService.updatePassword(req.user.userId, data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/me')
  getMe(@Request() req) {
    return this.accountService.getAccount(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  getAccount(@Param('id') id) {
    return this.accountService.getAccount(id);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('')
  getAccounts(@Request() req) {
    return this.accountService.getAllAccounts(req.user.role, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.accountService.forgotPassword(data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('reset-password')
  resetPassword(
    @Param('passwordResetToken') token: string,
    @Body() data: PasswordResetDto,
  ) {
    return this.accountService.resetPassword(token, data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch('update-me')
  updateMe(@Request() req, @Body() data: UpdateAccountDto) {
    return this.accountService.updateAccount(req.user.userId, data);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch('update')
  updateAccount(@Query('id') id, @Body() data: UpdateAccountDto) {
    return this.accountService.updateAccount(id, data);
  }
}
