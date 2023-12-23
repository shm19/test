import { Event } from 'src/event/entities/event.entity';
import { Point } from 'src/point/entities/point.entity';

export type CreateEventAndPointType = {
  eventEntities: Event[];
  pointEntities: Point[];
};
