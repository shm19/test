import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from 'src/settings/models/settings.model';
import { AddSettingDto } from './dto/add-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel('Setting') private settingModel: Model<Setting>) {}

  async findAll(): Promise<Setting[]> {
    const settings = await this.settingModel.find({});
    return settings;
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingModel.findById(id);
    return setting;
  }

  async remove(id: string): Promise<Setting> {
    const deletedSetting = await this.settingModel.findByIdAndRemove(id);
    if (!deletedSetting) {
      throw new HttpException('Setting not found', HttpStatus.NOT_FOUND);
    }
    return deletedSetting;
  }

  async create(data: AddSettingDto): Promise<Setting> {
    const setting = await this.settingModel.create(data);
    return setting;
  }

  async update(data: UpdateSettingDto, id: string): Promise<Setting> {
    const updatedSetting = await this.settingModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedSetting) {
      throw new HttpException('Setting not found.', HttpStatus.NOT_FOUND);
    }
    return updatedSetting;
  }
}
