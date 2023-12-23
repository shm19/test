import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Event } from 'src/event/entities/event.entity';
import { GPS } from 'src/signal/entities/gps.entity';
import { calcDegree, calcDistance } from 'src/utils/gps';
import { Point } from './entities/point.entity';
import { PointStatus } from './entities/point-status.entity';

type PointWithDistance = Point & {
  distance: number;
};

type MatchCondition = { _id?: { $ne: any } } | Record<string, any>;

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point.name) private readonly pointModel: Model<Point>,
    @InjectModel(PointStatus.name)
    private readonly pointStatusModel: Model<PointStatus>,
  ) {}

  private createRectanble(
    lng1: number,
    lat1: number,
    lng2: number,
    lat2: number,
    degree: number,
  ): number[][] {
    const distance = 0.00004;
    const points: number[][] = [];

    // x1 = xA - sin(θ) * distance
    // y1 = yA + cos(θ) * distance
    points.push([
      lng1 - Math.sin(degree) * distance,
      lat1 + Math.cos(degree) * distance,
    ]);

    // x2 = xB - sin(θ) * distance
    // y2 = yB + cos(θ) * distance
    points.push([
      lng2 - Math.sin(degree) * distance,
      lat2 + Math.cos(degree) * distance,
    ]);

    // x3 = xB + sin(θ) * distance
    // y3 = yB - cos(θ) * distance

    points.push([
      lng2 + Math.sin(degree) * distance,
      lat2 - Math.cos(degree) * distance,
    ]);

    // x4 = xA + sin(θ) * distance
    // y4 = yA - cos(θ) * distance
    points.push([
      lng1 + Math.sin(degree) * distance,
      lat1 - Math.cos(degree) * distance,
    ]);

    points.push(points[0]);
    return points;
  }

  private binarySearchClosest(
    gpsData: GPS[],
    pointCoordinates: number[],
  ): number {
    let low = 0;
    let high = gpsData.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const distances = [
        {
          index: low,
          value: calcDistance(pointCoordinates, gpsData[low].coordinates),
        },
        {
          index: mid,
          value: calcDistance(pointCoordinates, gpsData[mid].coordinates),
        },
        {
          index: high,
          value: calcDistance(pointCoordinates, gpsData[high].coordinates),
        },
      ];

      distances.sort((a, b) => a.value - b.value);

      if (distances[0].index === low) {
        high = mid;
      } else if (distances[0].index === high) {
        low = mid;
      } else {
        const leftDistance = calcDistance(
          pointCoordinates,
          gpsData[mid - 1].coordinates,
        );
        const rightDistance = calcDistance(
          pointCoordinates,
          gpsData[mid + 1].coordinates,
        );

        if (leftDistance < distances[0].value) {
          high = mid;
        } else if (rightDistance < distances[0].value) {
          low = mid;
        } else {
          return gpsData[mid].time;
        }
      }
    }

    return gpsData[low].time;
  }

  public async getPointTimes(gpsData: GPS[]): Promise<number[]> {
    const degree = calcDegree(
      gpsData[0].coordinates[1],
      gpsData[0].coordinates[0],
      gpsData[1].coordinates[1],
      gpsData[1].coordinates[0],
    );

    const rectanglePoints = this.createRectanble(
      gpsData[0].coordinates[1],
      gpsData[0].coordinates[0],
      gpsData[1].coordinates[1],
      gpsData[1].coordinates[0],
      degree,
    );

    const points = await this.pointModel.find({
      gps: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [rectanglePoints],
          },
        },
      },
    });

    if (points.length === 0) return [];

    const times: number[] = [];

    for (const point of points) {
      const chosenTime = this.binarySearchClosest(
        gpsData,
        point.gps.coordinates,
      );
      times.push(chosenTime);
    }

    return times;
  }

  async createPointsAndProcess(events: Event[]): Promise<Point[]> {
    const points = await this.createOrUpdatePoints(events);
    return this.mergePoints(points);
  }

  private async findNearestPoint(
    matchCondition: MatchCondition,
    distance: number,
    location: [number, number],
  ): Promise<PointWithDistance | undefined> {
    const points: PointWithDistance[] = await this.pointModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: location,
          },
          distanceField: 'distance',
          maxDistance: distance,
          spherical: true,
        },
      },
      {
        $match: matchCondition,
      },
    ]);

    const point: PointWithDistance | undefined = points.find(
      (p) => p.distance === Math.min(...points.map((e) => e.distance)),
    );

    return point;
  }

  // should also update the location based on new event
  private async updatePointEntity(
    point: Point,
    eventId: mongoose.Types.ObjectId,
  ): Promise<Point> {
    point.events.push(eventId);
    return point.save();
  }

  // should also add pointstatus
  private async createPointEntity(event: Event): Promise<Point> {
    return this.pointModel.create({
      events: [event._id],
      location: {
        type: 'Point',
        coordinates: event.gps?.coordinates,
      },
      statusHistory: [this.pointStatusModel.create()],
    });
  }

  private async createOrUpdatePoints(events: Event[]): Promise<Point[]> {
    const eventsWithGps = events.filter((e) => e.gps);
    const createNewPointDistance = 100;

    if (eventsWithGps.length === 0) return [];

    const pointsPromises = eventsWithGps.map(async ({ gps, _id: eventId }) => {
      const point = await this.findNearestPoint(
        {},
        createNewPointDistance,
        gps.coordinates,
      );
      if (point !== undefined) {
        return this.updatePointEntity(point, eventId);
      }
      return this.createPointEntity(eventId);
    });

    const points = await Promise.all(pointsPromises);
    return points;
  }

  private async mergeTwoPoint(firstPoint: Point, secondPoint: Point) {
    const { coordinates: firstCoordinates } = firstPoint.gps;
    const { coordinates: secondCoordinates } = secondPoint.gps;

    const mergedPoint = await this.pointModel.create({
      gps: {
        coordinates: [
          (firstCoordinates[0] + secondCoordinates[0]) / 2,
          (firstCoordinates[1] + secondCoordinates[1]) / 2,
        ],
      },
      events: [...firstPoint.events, ...secondPoint.events],
      time:
        new Date(firstPoint.time) < new Date(secondPoint.time)
          ? firstPoint.time
          : secondPoint.time,
      counter: firstPoint.counter,
      degree: (firstPoint.degree + secondPoint.degree) / 2 || undefined,
      statusHistory: [
        ...firstPoint.statusHistory.slice(1),
        ...secondPoint.statusHistory,
        // await this.pointStatusModel.create({ type: 'merged' }), add later
      ],
    });
    await Promise.all([this.pointModel.findByIdAndDelete(firstPoint._id)]);
    this.pointModel.findByIdAndDelete(secondPoint._id);
    return mergedPoint;
  }

  private mergePoints(points: Point[]): Point[] {
    // @TODO: read this from database
    const mergePointsDistance = 5;

    points.forEach(async (point) => {
      const nearPoint = await this.findNearestPoint(
        { _id: { $ne: point._id } },
        mergePointsDistance,
        [point.gps.coordinates[0], point.gps.coordinates[1]],
      );

      if (nearPoint !== undefined) {
        const mergedPoint = await this.mergeTwoPoint(point, nearPoint);
        points.filter((e) => e._id !== point._id || e._id !== nearPoint._id);
        points.push(mergedPoint);
      }
    });

    return points;
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
