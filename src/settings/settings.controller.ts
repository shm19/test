import {
  Controller,
  UseGuards,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import { HasRoles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../types/role.enum';
import { Setting } from './models/settings.model';
import { AddSettingDto } from './dto/add-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingService.findAll();
  }

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  findOne(@Param('id') id): Promise<Setting> {
    return this.settingService.findOne(id);
  }

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  remove(@Param('id') id): Promise<any> {
    return this.settingService.remove(id);
  }

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post()
  create(@Body() data: AddSettingDto): Promise<Setting> {
    return this.settingService.create(data);
  }

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch(':id')
  update(@Param('id') id, @Body() data: UpdateSettingDto): Promise<Setting> {
    return this.settingService.update(data, id);
  }
}
