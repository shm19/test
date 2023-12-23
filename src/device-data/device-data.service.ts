/* eslint-disable no-restricted-syntax */
import { Injectable } from '@nestjs/common';
import { SignalService } from 'src/signal/signal.service';
import { ExtractedAccData } from 'src/event/types/extracted-acc-data';
import { Signal } from 'src/signal/entities/signal.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PointService } from 'src/point/point.service';
import { Event } from 'src/event/entities/event.entity';
import { EventLocationService } from 'src/event/event-location.service';
import { GPS } from 'src/signal/entities/gps.entity';
import { DeviceService } from 'src/device/device.service';
import { MyLoggerService } from 'src/logger/myLogger.service';
import { AccelerationDto } from './dtos/acceleration.dto';
import { GPSDto } from './dtos/gps.dto';
import { ElectricityDto } from './dtos/electricity.dto';
import { LaserDto } from './dtos/laser.dto';
import { TempGps } from './entities/temp-gps.entity';
import { TempAcceleration } from './entities/temp-acceleration.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { AccelerationService } from './acceleration.service';
import { GpsService } from './gps.service';
import { TempLaser } from './entities/temp-laser.entity';
import { AccData } from './types/accelerationDataType';
import { LaserService } from './laser.service';
import { CreateEventAndPointType } from './types/create-event-and-point.type';

export type LaserData = [
  number,
  [number, number],
  [number, number],
  [number, number],
  [number, number],
][];

@Injectable()
export class DeviceDataService {
  constructor(
    private readonly signalService: SignalService,
    private readonly laserService: LaserService,
    private readonly eventLocationService: EventLocationService,
    private readonly pointService: PointService,
    private readonly accelerationService: AccelerationService,
    private readonly gpsService: GpsService,
    private readonly deviceService: DeviceService,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(TempGps.name) private readonly TempGpsModel: Model<TempGps>,
    @InjectModel(TempAcceleration.name)
    private readonly TempAccelerationModel: Model<TempAcceleration>,
    @InjectModel(TempLaser.name)
    private readonly TempLaserModel: Model<TempLaser>,
    private readonly logger: MyLoggerService,
  ) {}

  private async handleMissingGpsData<T, U>(
    gpsData: TempGps[],
    time: Date,
    deviceId: mongoose.Types.ObjectId,
    data: T,
    model: Model<U>,
    dataType: string,
  ): Promise<boolean> {
    if (gpsData && gpsData.length !== 0) {
      return true;
    }

    this.logger.log(
      `Adding temp ${dataType} data, since there is no GPS to create events`,
    );
    await model.create({ time, deviceId, data });

    return false;
  }

  async processAccelerationData(
    accelerationBody: AccelerationDto,
  ): Promise<Signal | CreateEventAndPointType> {
    const { deviceId, time } = accelerationBody;

    const accelerationData = accelerationBody.data;
    const device = await this.deviceService.findOne(deviceId);

    const signal = await this.accelerationService.addAccelerationSignal(
      accelerationBody,
      device,
    );
    this.logger.log(`added acceleration data into signal ${signal._id}`);

    const gpsData = await this.TempGpsModel.find({ deviceId, time });

    const haveGps = await this.handleMissingGpsData(
      gpsData,
      time,
      deviceId,
      accelerationData,
      this.TempAccelerationModel,
      'acceleration',
    );

    if (!haveGps) return signal;

    this.logger.log(`creating events and points for ${signal._id})`);
    return this.createEventsAndPointsForAcceleration(
      deviceId,
      accelerationData,
      gpsData.map((e) => e.toObject()),
      signal,
    );
  }

  async processLaserData(
    laserBody: LaserDto,
  ): Promise<Signal | CreateEventAndPointType> {
    const { deviceId, time, data: laserData } = laserBody;

    const signal = await this.laserService.addLaserSignal(laserBody);
    this.logger.log(`added laser data into signal ${signal._id}`);

    const gpsData = await this.TempGpsModel.find({ deviceId, time });

    const haveGps = await this.handleMissingGpsData(
      gpsData,
      time,
      deviceId,
      laserData,
      this.TempLaserModel,
      'laser',
    );

    if (!haveGps) return signal;

    this.logger.log(`creating events and points for ${signal._id})`);
    return this.createEventsAndPointsForLaser(
      deviceId,
      laserData,
      gpsData.map((e) => e.toObject()),
      signal,
    );
  }

  private async createEventsAndPointsForAcceleration(
    deviceId: mongoose.Types.ObjectId,
    accelerationData: AccData,
    formattedGpsData: GPS[],
    signalEntity: Signal,
  ): Promise<CreateEventAndPointType> {
    const device = await this.deviceService.findOne(deviceId);
    const sensorNumber = device.defaultAccelerationSensor;

    const extractAccData = this.accelerationService.extractAccData(
      accelerationData,
      sensorNumber,
    );

    return this.createEventsAndPoints({
      gpsData: formattedGpsData,
      data: extractAccData,
      signal: signalEntity,
      deviceId,
      type: 'acceleration',
    });
  }

  private async createEventsAndPointsForLaser(
    deviceId: mongoose.Types.ObjectId,
    laserData: LaserData,
    gpsData: GPS[],
    signalEntity: Signal,
  ) {
    return this.createEventsAndPoints({
      gpsData,
      data: laserData,
      signal: signalEntity,
      deviceId,
      type: 'laser',
    });
  }

  async processGpsData(gpsBody: GPSDto) {
    const { time, deviceId } = gpsBody;

    const [signalEntity, accelerationData, laserData] = await Promise.all([
      this.gpsService.addGpsSignal(gpsBody),
      this.TempAccelerationModel.findOne({
        deviceId,
        time,
      }),
      this.TempLaserModel.findOne({
        deviceId,
        time,
      }),
    ]);

    if (!accelerationData || !laserData) {
      const gpsData = gpsBody.data;

      await this.TempGpsModel.create({
        time,
        deviceId,
        gpsData,
      });
      return signalEntity;
    }

    const gpsData = this.gpsService.formatGpsData(gpsBody.data);

    if (accelerationData) {
      return this.createEventsAndPointsForAcceleration(
        deviceId,
        accelerationData.data,
        gpsData,
        signalEntity,
      );
    }

    return this.createEventsAndPointsForLaser(
      deviceId,
      laserData.toObject(),
      gpsData,
      signalEntity,
    );
  }

  async addElectricity(electricityBody: ElectricityDto): Promise<Signal> {
    const { deviceId, time, data } = electricityBody;

    const electricityObj = {
      voltage: data[0],
      current: data[1],
      battery: data[2],
      percentage: data[3],
    };

    const totalElectricityData = Object.keys(electricityObj).length;

    const signal = await this.signalService.addElectricity(
      { deviceId, time },
      electricityObj,
      totalElectricityData,
    );
    return signal;
  }

  // @todo: from below here we can make an event module for this
  private transformEvents(
    events: CreateEventDto[],
    signal: Signal,
    deviceId: mongoose.Types.ObjectId,
  ): Event[] {
    const { _id: signalId, time } = signal;

    return events.map((e) => {
      const { min, max, kur, value } = e.value;

      const newEvent = {
        passedTime: e.hitTime,
        sentTime: time,
        value,
        min,
        max,
        kur,
        deviceId,
        signalId,
        type: 'acc',
      } as Event;

      return newEvent;
    });
  }

  private async createEventsEntities(eventObjects: Event[]): Promise<Event[]> {
    const eventsEntity = await Promise.all(
      eventObjects.map((eventObject) => this.eventModel.create(eventObject)),
    );

    return eventsEntity;
  }

  private async processDataByType(
    data: ExtractedAccData | LaserData,
    type: string,
    gps: GPS[],
  ): Promise<CreateEventDto[]> {
    switch (type) {
      case 'acceleration':
        return this.accelerationService.sendAccelerationDataToAi(
          data as ExtractedAccData,
          gps,
        );
      case 'laser':
        return this.laserService.createLaserEvents(data as LaserData);
      default:
        throw new Error('Unsupported type');
    }
  }

  async createEventsAndPoints({
    gpsData,
    data,
    signal,
    deviceId,
    type,
  }: {
    gpsData: GPS[];
    data: ExtractedAccData | LaserData;
    signal: Signal;
    deviceId: mongoose.Types.ObjectId;
    type: string;
  }): Promise<CreateEventAndPointType> {
    const eventObjects = await this.processDataByType(data, type, gpsData);

    const eventObjectsWithLocation =
      await this.eventLocationService.setEventsLocation(eventObjects, gpsData);

    const transformedEventObjects = this.transformEvents(
      eventObjectsWithLocation,
      signal,
      deviceId,
    );

    const eventEntities = await this.createEventsEntities(
      transformedEventObjects,
    );

    const pointEntities = await this.pointService.createPointsAndProcess(
      eventEntities,
    );

    return {
      eventEntities,
      pointEntities,
    };
  }
}
