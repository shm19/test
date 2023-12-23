import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  findAll(@Query('key') key: string) {
    return this.settingService.findAll(key);
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return this.settingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingService.update(id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId) {
    return this.settingService.remove(id);
  }
}
