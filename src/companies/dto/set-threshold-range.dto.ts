import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ThresholdDto } from './threshold.dto';
import { RangeDto } from './ranges.dto';

export class SetThresholdAndRangeDto {
  @Type(() => ThresholdDto)
  @IsNotEmpty()
  @ValidateNested()
  thresholds: ThresholdDto;

  @Type(() => RangeDto)
  @IsNotEmpty()
  @ValidateNested()
  ranges: RangeDto;
}
