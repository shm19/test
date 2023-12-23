import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Point, PointSchema } from './entities/point.entity';
import { PointService } from './point.service';
import { PointStatus, PointStatusSchema } from './entities/point-status.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Point.name,
        schema: PointSchema,
      },
      {
        name: PointStatus.name,
        schema: PointStatusSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
