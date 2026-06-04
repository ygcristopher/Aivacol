import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString({ message: 'License plate must be a string' })
  @Matches(/^[A-Z]{3}\d{4}$/, {
    message: 'License plate must follow format: ABC1234',
  })
  plate?: string;

  @IsOptional()
  @IsString({ message: 'Chassis must be a string' })
  @MinLength(5, { message: 'Chassis must be at least 5 characters' })
  @MaxLength(30, { message: 'Chassis must not exceed 30 characters' })
  chassis?: string;

  @IsOptional()
  @IsString({ message: 'RENAVAM must be a string' })
  @Matches(/^\d{11}$/, { message: 'RENAVAM must be exactly 11 digits' })
  renavam?: string;

  @IsOptional()
  @IsInt({ message: 'Year of manufacture must be an integer' })
  @Min(1900, { message: 'Year must be 1900 or later' })
  @Max(2100, { message: 'Year must not exceed 2100' })
  yearManufacture?: number;

  @IsOptional()
  @IsInt({ message: 'Model ID must be an integer' })
  @Min(1, { message: 'Model ID must be a positive number' })
  modelId?: number;
}
