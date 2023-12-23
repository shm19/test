import { Expose } from 'class-transformer';

export class ResponseDeviceDto {
  @Expose()
  name: string;
}
