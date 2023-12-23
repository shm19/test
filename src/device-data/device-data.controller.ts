import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { serialize } from 'src/common/interceptors/serialize.interceptor';
import { DeviceService } from 'src/device/device.service';
import { MetadataInterceptor } from './interceptors/metadata.interceptor';
import { AccelerationDto } from './dtos/acceleration.dto';
import { SignalInterceptor } from './interceptors/signal.interceptor';
import { GPSDto } from './dtos/gps.dto';
import { TransformRequestBodyInterceptor } from './interceptors/transform-request-body.interceptor';
import { SystemMetricDto } from './dtos/systemMetric.dto';
import { TimeSanitizerInterceptor } from './interceptors/timeSanitizer.interceptor';
import { ElectricityDto } from './dtos/electricity.dto';
import { LaserDto } from './dtos/laser.dto';
import { DeviceDataService } from './device-data.service';

@Controller('device-data')
@UseInterceptors(TransformRequestBodyInterceptor, MetadataInterceptor)
export class DeviceDataController {
  constructor(
    private readonly deviceDataService: DeviceDataService,
    private readonly deviceService: DeviceService,
  ) {}

  @Post('acceleration')
  @UseInterceptors(serialize(AccelerationDto), SignalInterceptor)
  async addAcceleration(@Body() body: AccelerationDto) {
    return this.deviceDataService.processAccelerationData(body);
  }

  @Post('laser')
  @UseInterceptors(serialize(LaserDto), SignalInterceptor)
  async addLaser(@Body() body: LaserDto) {
    return this.deviceDataService.processLaserData(body);
  }

  @Post('gps')
  @UseInterceptors(serialize(GPSDto), SignalInterceptor)
  addGPs(@Body() body: GPSDto) {
    return this.deviceDataService.processGpsData(body);
  }

  @Post('electricity')
  @UseInterceptors(serialize(ElectricityDto), SignalInterceptor)
  addElectricity(@Body() body: ElectricityDto) {
    return this.deviceDataService.addElectricity(body);
  }

  @Post('systemMetric')
  @UseInterceptors(
    TimeSanitizerInterceptor,
    serialize(SystemMetricDto),
    SignalInterceptor,
  )
  addSystemMetric(@Body() body: SystemMetricDto) {
    return this.deviceService.addSystemMetric(body);
  }
}
