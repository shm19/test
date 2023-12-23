import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SystemMetricDto } from 'src/device-data/dtos/systemMetric.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly DeviceModel: Model<Device>,
  ) {}

  private async getLasetMobileDevice(): Promise<Device> {
    return this.DeviceModel.findOne(
      { type: 'mobile' },
      {},
      { sort: { created_time: -1 } },
    );
  }

  private generateNewMobileDeviceName(deviceName: string): string {
    let lastCounter: number;
    if (deviceName) {
      lastCounter = parseInt(deviceName.replace('MA', ''), 10) + 1;
    }

    const newCounter = lastCounter.toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });

    const newName = `MA${newCounter}`;
    return newName;
  }

  async create(deviceBody: CreateDeviceDto): Promise<Device> {
    let device = await this.DeviceModel.findOne({
      type: 'mobile',
      hardwareId: deviceBody.hardwareId,
    });

    if (device) {
      return device;
    }

    if (deviceBody.type === 'mobile') {
      const lastDevice = await this.getLasetMobileDevice();
      const newName = this.generateNewMobileDeviceName(lastDevice.name);
      deviceBody.name = newName;
    }

    device = new this.DeviceModel(deviceBody);
    return device.save();
  }

  async findAll(): Promise<Device[]> {
    return this.DeviceModel.find();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<Device> {
    const device = await this.DeviceModel.findById(id);
    if (!device) {
      throw new HttpException('No device found', HttpStatus.NOT_FOUND);
    }
    return device;
  }

  async update(
    id: mongoose.Types.ObjectId,
    updateDeviceBody: UpdateDeviceDto,
  ): Promise<Device> {
    const updatedDevice = await this.DeviceModel.findByIdAndUpdate(
      id,
      updateDeviceBody,
      { new: true },
    );
    if (!updatedDevice) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return updatedDevice;
  }

  async remove(id: mongoose.Types.ObjectId): Promise<Device> {
    const deletedDevice = await this.DeviceModel.findByIdAndRemove(id);
    if (!deletedDevice) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return deletedDevice;
  }

  async addSystemMetric(systemMetricBody: SystemMetricDto) {
    const { deviceId, data: systemMetricData } = systemMetricBody;

    const device = await this.findOne(deviceId);

    device.metric = {
      ...systemMetricData,
      lastBoot: new Date(systemMetricData.lastBoot),
    };

    await device.save();
  }
}
