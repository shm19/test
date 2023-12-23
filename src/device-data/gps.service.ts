/* eslint-disable no-restricted-syntax */
import { SignalService } from 'src/signal/signal.service';
import { calcDegree, calcDistance } from 'src/utils/gps';
import { GPS } from 'src/signal/entities/gps.entity';
import { Injectable } from '@nestjs/common';
import { Signal } from 'src/signal/entities/signal.entity';
import { GPSDto } from './dtos/gps.dto';

type GpsData = [number, number, number, number][];

@Injectable()
export class GpsService {
  constructor(private readonly signalService: SignalService) {}

  public formatGpsData(gpsData: GpsData): GPS[] {
    return gpsData.map((el) => ({
      time: Number(el[0]),
      type: 'point',
      coordinates: [Number(el[2]), Number(el[1])],
      speed: Number(el[3]) || 0,
    }));
  }

  private removeUnexpectedLoc(gpsData: GPS[]): GPS[] {
    // @todo: read out_of_range_location from db
    const maxDistance = 83;

    let i = 0;
    let dataLength = gpsData.length - 1;
    while (i < dataLength) {
      const distance = calcDistance(
        [gpsData[i][2], gpsData[i][1]],
        [gpsData[i + 1][2], gpsData[i + 2][1]],
      );
      const timeDiff = Math.abs(gpsData[i][0] - gpsData[i + 1][0]) / 1000;
      const criteria = distance / timeDiff;
      if (criteria > maxDistance) {
        gpsData.splice(i + 1, 1);
        i--;
        dataLength--;
      }
      i++;
    }
    return gpsData;
  }

  private calcAvgSpeed(gpsData: GPS[]): number {
    return (
      gpsData.map((el) => el.speed).reduce((acc, curr) => acc + curr, 0) /
      gpsData.length
    );
  }

  private getSignalDegree(gpsData: GPS[]): number {
    return calcDegree(
      gpsData[0].coordinates[1],
      gpsData[0].coordinates[0],
      gpsData[gpsData.length - 1].coordinates[1],
      gpsData[gpsData.length - 1].coordinates[0],
    );
  }

  private calcTotal(data: number[]): number {
    const lasetElement = data[data.length - 1];
    const firstElement = data[0];

    return lasetElement - firstElement + 1;
  }

  private setSignalDataForGps(gpsBody) {
    this.checkGpsData(gpsBody);

    const gpsData = this.formatGpsData(gpsBody.data);

    const newGPsData = this.removeUnexpectedLoc(gpsData);

    const avgSpeed = this.calcAvgSpeed(newGPsData);
    const degree = this.getSignalDegree(newGPsData);

    const gpsTimes = newGPsData.map((el) => el.time);
    const totalGpsData = this.calcTotal(gpsTimes);

    return {
      gps: newGPsData,
      avgSpeed,
      degree,
      totalGpsData,
    };
  }

  async addGpsSignal(gpsBody: GPSDto): Promise<Signal> {
    const { time } = gpsBody;

    const gpsData = this.formatGpsData(gpsBody.data);

    const { totalGpsData, ...signalData } = this.setSignalDataForGps(gpsData);

    const signalEntity = await this.signalService.addGps(
      { deviceId: gpsBody.deviceId, time },
      signalData,
      totalGpsData,
    );

    return signalEntity;
  }

  // @todo: implment later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private checkGpsData(gpsBody: GPSDto) {
    // here should check gps format and if anything wrong thorw error
    return true;
  }
}
