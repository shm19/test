import { HttpException, Injectable } from '@nestjs/common';
import { SignalService } from 'src/signal/signal.service';
import { ExtractedAccData } from 'src/event/types/extracted-acc-data';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Device } from 'src/device/entities/device.entity';
import { Signal } from 'src/signal/entities/signal.entity';
import { GPS } from 'src/signal/entities/gps.entity';
import { PointService } from 'src/point/point.service';
import { AccelerationDto } from './dtos/acceleration.dto';
import { AccStatusTypes } from './types/AccStatusTypes';
import { AccData } from './types/accelerationDataType';
import { AIEventResponse } from './interfaces/ai.event.response.interface';
import { CreateEventDto } from './dtos/create-event.dto';

type AccSensorData = number[][][];
type CounterData = number[];

@Injectable()
export class AccelerationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly signalService: SignalService,
    private readonly pointService: PointService,
  ) {}

  public extractAccData(
    accelerationData: AccData,
    sensorNumber: number,
  ): ExtractedAccData {
    const sensoredData = accelerationData.map((el) => el[2][sensorNumber]);

    const avgX =
      sensoredData.reduce((acc, curr) => acc + curr[0], 0) /
      sensoredData.length;
    const avgY =
      sensoredData.reduce((acc, curr) => acc + curr[1], 0) /
      sensoredData.length;
    const avgZ =
      sensoredData.reduce((acc, curr) => acc + curr[2], 0) /
      sensoredData.length;

    const AccDataWithS = sensoredData.map(([x, y, z]) =>
      Math.sqrt((x - avgX) ** 2 + (y - avgY) ** 2 + (z - avgZ) ** 2),
    );

    return AccDataWithS.map((e, i) => [accelerationData[i][0], e]);
  }

  private calcAvgAccData(
    accSensorData: AccSensorData,
    sensorNumber: number,
  ): number {
    const sumOfSensorData = accSensorData.reduce(
      (acc, curr) => acc + Number(curr[sensorNumber - 1][2]),
      0,
    );
    return sumOfSensorData / accSensorData.length;
  }

  private calcStd(
    accData: AccSensorData,
    sensorNumber: number,
    avgData: number,
  ): number {
    const variance = this.calculateVariance(accData, sensorNumber, avgData);
    return Math.sqrt(variance);
  }

  private calculateVariance(
    accData: AccSensorData,
    sensorNumber: number,
    avgData: number,
  ): number {
    const accDataLength = accData.length;

    const sumOfSquareDifferences = accData.reduce(
      (acc, curr) => acc + (Number(curr[sensorNumber - 1][2]) - avgData) ** 2,
      0,
    );

    return sumOfSquareDifferences / accDataLength;
  }

  private calcAccMissData(counterData: CounterData) {
    let missData = 0;
    for (let i = 1; i < counterData.length; i++)
      missData += counterData[i] - counterData[i - 1] - 1;
    return missData;
  }

  private calcTotal(data: number[]): number {
    const lasetElement = data[data.length - 1];
    const firstElement = data[0];

    return lasetElement - firstElement + 1;
  }

  private calcAccelerationDuration(accelerationData: AccSensorData): number {
    const lastElement = accelerationData[accelerationData.length - 1] as [
      number,
      any,
    ];
    const firstElement = accelerationData[0] as [number, any];

    return lastElement[0] - firstElement[0];
  }

  private setAccStatus(accelerationData, enabledSensors) {
    const accStatus = Array.from({ length: 4 }, () => AccStatusTypes.UNKNOWN);

    for (
      let sensorNumber = 0;
      sensorNumber < enabledSensors.length;
      sensorNumber++
    ) {
      if (!enabledSensors[sensorNumber]) continue;

      // use param z for this checking [2]
      const acc = accelerationData.map((e) => e[sensorNumber][2]);
      const firstValue = acc[0];
      const isConstant = acc.every((value) => value === firstValue);

      accStatus[sensorNumber] = isConstant
        ? AccStatusTypes.CONSTANT
        : AccStatusTypes.OK;
    }

    return accStatus;
  }

  private async setSignalDataForAcceleration({ accelerationData, device }) {
    const { accelerationSensors, defaultAccelerationSensor } = device;

    const missData = this.calcAccMissData(accelerationData);

    const enabledSensors = accelerationSensors.map((e) => e.enabled);

    const accelerationSensorData = accelerationData.map((e) => e[2]);

    const accStatus = this.setAccStatus(accelerationSensorData, enabledSensors);

    const avgData = this.calcAvgAccData(
      accelerationSensorData,
      defaultAccelerationSensor,
    );
    const std = this.calcStd(
      accelerationSensorData,
      defaultAccelerationSensor,
      avgData,
    );

    const totalAccData = this.calcTotal(accelerationSensorData);

    const accDuration =
      accelerationData[accelerationData.length - 1][0] - accelerationData[0][0];

    return {
      accDuration,
      accStatus,
      sensorNumber: defaultAccelerationSensor,
      std,
      missData,
      totalAccData,
    };
  }

  async addAccelerationSignal(
    accelerationBody: AccelerationDto,
    device: Device,
  ): Promise<Signal> {
    const { deviceId, time } = accelerationBody;
    const accelerationData = accelerationBody.data;

    const { totalAccData, ...signalData } =
      await this.setSignalDataForAcceleration({
        accelerationData,
        device,
      });

    const signalEntity = await this.signalService.addAcceleration(
      { deviceId, time },
      signalData,
      totalAccData,
    );

    return signalEntity;
  }

  public async sendAccelerationDataToAi(
    accelerationData: ExtractedAccData,
    gpsData: GPS[],
  ): Promise<CreateEventDto[]> {
    const pointTimes = await this.pointService.getPointTimes(gpsData);

    const obserbableResponse = this.httpService
      .post(
        'http://52.59.189.250:8000/event_detection',
        { data: { accelerationData, pointTimes } },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((response: AIEventResponse) => {
          const responseData = response.data;

          if (!responseData || !responseData.events) {
            throw new HttpException('Something went wrong', 500);
          }

          const eventObjects = responseData.events.map((e) =>
            plainToInstance(
              CreateEventDto,
              {
                ...e,
                type: 'acceleration',
                value: {
                  value: e.value.acc,
                },
              },
              {
                excludeExtraneousValues: true,
              },
            ),
          );
          return eventObjects.map((e) => ({ ...e, type: 'acceleration' }));
        }),
      );

    return lastValueFrom(obserbableResponse);
  }

  // @todo: implement later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private checkAccelerationData(accelerationBody: AccelerationDto) {
    // here should check acceleration format and if anything wrong thorw error
    return true;
  }
}
