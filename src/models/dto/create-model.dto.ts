import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateModelDto {
  @IsNotEmpty({ message: 'Model name is required' })
  @IsString({ message: 'Model name must be a string' })
  @MinLength(2, { message: 'Model name must be at least 2 characters' })
  @MaxLength(120, { message: 'Model name must not exceed 120 characters' })
  name!: string;

  @IsOptional()
  @IsInt({ message: 'Brand ID must be an integer' })
  @Min(1, { message: 'Brand ID must be a positive number' })
  brandId?: number | null;
}
