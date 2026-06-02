import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  plate?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  chassis?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  renavam?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearManufacture?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  modelId?: number;
}
