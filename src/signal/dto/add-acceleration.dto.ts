import { IsNumber, IsNotEmpty } from 'class-validator';
import { IsInRange } from 'src/common/validators/is-in-range.validator';

export class AddAccelerationDto {
  @IsNumber()
  accDuration: number;

  @IsNotEmpty({ each: true })
  @IsInRange(0, 4, {
    message:
      'Each number in accStatus should be greater than 0 and less than 4',
  })
  accStatus: number[];

  @IsNumber()
  sensorNumber: number;

  @IsNumber()
  std: number;

  @IsNumber()
  missData: number;
}
