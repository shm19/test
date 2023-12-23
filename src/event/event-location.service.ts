import { Injectable } from '@nestjs/common';
import { CreateEventDto } from 'src/device-data/dtos/create-event.dto';
import { GPS } from 'src/signal/entities/gps.entity';
import { calcDistance } from 'src/utils/gps';

interface EventLocationResult {
  gps: [number, number] | [];
  speed: number;
}

@Injectable()
export class EventLocationService {
  private calcEventLocation = (
    eventPassedTime: number,
    gpsArr: GPS[],
  ): EventLocationResult => {
    const emptyResult: EventLocationResult = { gps: [], speed: 0 };

    if (!gpsArr || gpsArr.length < 2) return emptyResult;

    let closestBeforeEvent: GPS | null = null;
    let closestAfterEvent: GPS | null = null;

    for (let i = 0; i < gpsArr.length - 1; i++) {
      const current = gpsArr[i];
      const next = gpsArr[i + 1];

      if (current.time <= eventPassedTime && next.time >= eventPassedTime) {
        closestBeforeEvent = current;
        closestAfterEvent = next;
        break;
      }
    }

    if (!closestBeforeEvent || !closestAfterEvent) return emptyResult;

    const timeDiff1 = eventPassedTime - closestBeforeEvent.time;
    const timeDiff2 = closestAfterEvent.time - eventPassedTime;

    const calcAvgLoc = (cor1: number, cor2: number): number =>
      (cor1 * timeDiff2 + cor2 * timeDiff1) / (timeDiff1 + timeDiff2);

    const speed = (closestBeforeEvent.speed + closestAfterEvent.speed) / 2;
    const log = calcAvgLoc(
      closestBeforeEvent.coordinates[0],
      closestAfterEvent.coordinates[0],
    );
    const lat = calcAvgLoc(
      closestBeforeEvent.coordinates[1],
      closestAfterEvent.coordinates[1],
    );

    return { gps: [log, lat], speed };
  };

  private hasValidCoordinates(event: CreateEventDto): boolean {
    if (!event) return false;
    if (!event.gps) return false;
    if (!event.gps.coordinates) return false;
    return event.gps.coordinates.length === 2;
  }

  private getDistanceBetweenEvents(
    firstEvent: CreateEventDto,
    secondEvent: CreateEventDto,
  ): number {
    return calcDistance(
      firstEvent.gps.coordinates,
      secondEvent.gps.coordinates,
    );
  }

  private isNear(
    event: CreateEventDto,
    nextEvent: CreateEventDto,
    closeEventDistance: number,
  ) {
    if (nextEvent === undefined) {
      return true;
    }

    const { type: nextEventType } = nextEvent;
    const { type: eventType } = event;
    return (
      nextEventType !== eventType ||
      this.getDistanceBetweenEvents(event, nextEvent) >= closeEventDistance
    );
  }

  private removeCloseEvents(events: CreateEventDto[]): CreateEventDto[] {
    // @todo: read from database
    const closeEventDistance = 2;

    return events.filter((event, index) => {
      const nextEvent = events[index + 1];
      return this.isNear(event, nextEvent, closeEventDistance);
    });
  }

  private removeEventsWithNoSpeed(events: CreateEventDto[]): CreateEventDto[] {
    // @todo: read from databas
    const eventLimitSpeed = 2;

    const filteredEvents = events.filter((e) => e.speed > eventLimitSpeed);
    return filteredEvents;
  }

  async setEventsLocation(
    events: CreateEventDto[],
    gps: GPS[],
  ): Promise<CreateEventDto[]> {
    events.forEach((event) => {
      const result = this.calcEventLocation(event.hitTime, gps);
      if (result) {
        event.gps = { coordinates: result.gps };
        event.speed = result.speed;
      }
    });

    events = events.filter(this.hasValidCoordinates);

    events = this.removeCloseEvents(events);

    const filteredEvents = this.removeEventsWithNoSpeed(events);

    return filteredEvents;
  }
}
