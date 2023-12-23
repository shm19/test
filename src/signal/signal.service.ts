import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSignalTemplateDto } from './dto/create-signal-template.dto';
import { Signal } from './entities/signal.entity';
import { AddAccelerationDto } from './dto/add-acceleration.dto';

import { FilterDto } from './dto/filter-signal.dto';
import { addGpsDto } from './dto/add-gps.dto';
import { AddElectricityDto } from './dto/add-electricity.dto';
import { AddLaserDto } from './dto/add-laser.dto';

@Injectable()
export class SignalService {
  constructor(
    @InjectModel(Signal.name) private readonly signalModel: Model<Signal>,
  ) {}

  async addAcceleration(
    filter: FilterDto,
    acceleration: AddAccelerationDto,
    totalAccData: number,
  ): Promise<Signal> {
    try {
      return await this.signalModel.findOneAndUpdate(
        filter,
        {
          $set: {
            acceleration,
            'totalData.acceleration': totalAccData,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Could not add acceleration: ${error.message}`);
    }
  }

  async addGps(
    filter: FilterDto,
    addGpsData: addGpsDto,
    totalGpsData: number,
  ): Promise<Signal> {
    try {
      return this.signalModel.findOneAndUpdate(
        filter,
        {
          $set: {
            ...addGpsData,
            'totalData.gps': totalGpsData,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Could not add gps: ${error.message}`);
    }
  }

  async addElectricity(
    filter: FilterDto,
    electricityObj: AddElectricityDto,
    totalElectricity: number,
  ): Promise<Signal> {
    try {
      return this.signalModel.findOneAndUpdate(
        filter,
        {
          $set: {
            electricity: electricityObj,
            'totalData.electricity': totalElectricity,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Could not add electricity: ${error.message}`);
    }
  }

  async addLaser(
    filter: FilterDto,
    laserData: AddLaserDto,
    totalLaser: number,
  ): Promise<Signal> {
    try {
      return this.signalModel.findOneAndUpdate(
        filter,
        {
          $set: {
            laser: laserData,
            'totalData.laser': totalLaser,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Could not add electricity: ${error.message}`);
    }
  }

  createSignalTemplate(createSignalTemplate: CreateSignalTemplateDto) {
    const { time, deviceId } = createSignalTemplate;
    return this.signalModel.findOneAndUpdate(
      { time, deviceId },
      { $set: createSignalTemplate },
      { upsert: true, new: true },
    );
  }

  findAll() {
    return this.signalModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} signal`;
  }

  remove(id: number) {
    return `This action removes a #${id} signal`;
  }
}
