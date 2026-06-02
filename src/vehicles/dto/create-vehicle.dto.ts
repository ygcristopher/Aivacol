import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  plate!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  chassis!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  renavam!: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  yearManufacture!: number;

  @IsInt()
  @Min(1)
  modelId!: number;
}
