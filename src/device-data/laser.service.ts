/* eslint-disable no-restricted-syntax */
import { Injectable } from '@nestjs/common';
import { SignalService } from 'src/signal/signal.service';
import { Signal } from 'src/signal/entities/signal.entity';
import { LaserDto } from './dtos/laser.dto';
import { laserTypesMap } from './types/laserTypes';
import { EventPlace } from './types/event-place.enum';
import { CreateEventDto } from './dtos/create-event.dto';

enum LaserProperty {
  miliTime = 0,
  zigzag = 1,
  height = 2,
}

type LaserData = [
  number,
  [number, number],
  [number, number],
  [number, number],
  [number, number],
][];

@Injectable()
export class LaserService {
  constructor(private readonly signalService: SignalService) {}

  private getMinHeightAndIndex(
    dataElement: [
      number,
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    heightProperty: number,
  ): number {
    if (dataElement[heightProperty][1] === null) {
      return 0;
    }

    const flattenedArray = (dataElement[heightProperty] as number[]).flat();

    const minHeight = Math.min(...flattenedArray.filter((x) => x !== null));

    const minHeightIndex = flattenedArray.indexOf(minHeight);
    return minHeightIndex !== -1 ? minHeightIndex : 0;
  }

  async addLaserSignal(laserBody: LaserDto): Promise<Signal> {
    const { deviceId, time, data } = laserBody;
    const index = this.getMinHeightAndIndex(data[0], LaserProperty.height);

    const maxHeight = Math.max(
      ...data.map((e) => e[LaserProperty.height][index]),
    );
    const minHeight = Math.min(
      ...data.map((e) => e[LaserProperty.height][index]),
    );
    const maxZigzag = Math.min(
      ...data.map((e) => e[LaserProperty.zigzag][index]),
    );
    const totalLaser = Object.keys(laserBody).length;

    const signal = await this.signalService.addLaser(
      {
        time,
        deviceId,
      },
      {
        minHeight,
        maxHeight,
        maxZigzag,
      },
      totalLaser,
    );

    return signal;
  }

  private chooseEventPlace(
    eventPlace: EventPlace,
    dataRange: [number, number][],
    typeIndex: number,
  ): CreateEventDto {
    // the default behaivior is event happened at start
    const eventObject = {
      hitTime: dataRange[0][0],
      value: { value: dataRange[0][1] },
      type: laserTypesMap[typeIndex],
    };

    if (eventPlace === EventPlace.MAX) {
      const maxEntry = dataRange.reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        dataRange[0],
      );
      [eventObject.hitTime, eventObject.value.value] = maxEntry;
    } else if (eventPlace === EventPlace.END) {
      const length = dataRange.length - 1;
      [eventObject.hitTime, eventObject.value.value] = dataRange[length];
    }
    return eventObject;
  }

  public createLaserEvents(data: LaserData) {
    // @todo: this should be read from database
    const thresholdRange = [1, 100];
    const rangeTimeThreshold = 1;
    const usedIndex = 1;
    const eventPlace = EventPlace.START;

    const eventObjects: CreateEventDto[] = [];

    for (const laserTypeKey of laserTypesMap.keys()) {
      let dataRange: [number, number][] = [];

      for (const element of data) {
        const time = element[0];
        const value = element[laserTypeKey][usedIndex];

        if (value < thresholdRange[0] || value > thresholdRange[1]) {
          dataRange.push([time, value]);
        } else {
          const timeDiff = time - dataRange[0][0];
          if (timeDiff > rangeTimeThreshold) {
            eventObjects.push(
              this.chooseEventPlace(eventPlace, dataRange, laserTypeKey),
            );
          }
          dataRange = [];
        }
      }
    }

    return eventObjects;
  }
}
