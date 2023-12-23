import { Module } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { SignalModule } from 'src/signal/signal.module';
import { EventModule } from 'src/event/event.module';
import { PointModule } from 'src/point/point.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Event } from 'src/event/entities/event.entity';
import { DeviceDataController } from './device-data.controller';
import { TempGps, TempGpsSchema } from './entities/temp-gps.entity';
import { TempAcceleration } from './entities/temp-acceleration.entity';
import { LaserService } from './laser.service';
import { AccelerationService } from './acceleration.service';
import { GpsService } from './gps.service';
import { TempLaser } from './entities/temp-laser.entity';
import { DeviceDataService } from './device-data.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: TempGps.name,
        schema: TempGpsSchema,
      },
      {
        name: TempAcceleration.name,
        schema: TempAcceleration,
      },
      {
        name: TempLaser.name,
        schema: TempLaser,
      },
      {
        name: Event.name,
        schema: Event,
      },
    ]),
    DeviceModule,
    SignalModule,
    EventModule,
    PointModule,
  ],
  controllers: [DeviceDataController],
  providers: [DeviceDataService, LaserService, AccelerationService, GpsService],
})
export class DeviceDataModule {}
