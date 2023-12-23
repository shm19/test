import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
  ) {}

  async create(createSettingObj: CreateSettingDto) {
    try {
      return await this.settingModel.create(createSettingObj);
    } catch (error) {
      throw new BadRequestException(`Could not add setting: ${error.message}`);
    }
  }

  async findAll(key: string): Promise<Setting[]> {
    const filter = {};

    if (key) {
      filter[key] = { $regex: new RegExp(key, 'i') };
    }

    return this.settingModel.find(filter);
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<Setting> {
    return this.settingModel.findById(id);
  }

  async update(
    id: mongoose.Types.ObjectId,
    updateSettingObj: UpdateSettingDto,
  ): Promise<Setting> {
    return this.settingModel.findOneAndUpdate(
      { _id: id },
      {
        $set: updateSettingObj,
      },
      {
        runValidators: true,
        new: true,
      },
    );
  }

  async remove(id: mongoose.Types.ObjectId): Promise<Setting> {
    return this.settingModel.findOneAndDelete({ _id: id });
  }
}
