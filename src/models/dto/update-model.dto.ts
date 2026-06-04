import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateModelDto {
  @IsOptional()
  @IsString({ message: 'Model name must be a string' })
  @MinLength(2, { message: 'Model name must be at least 2 characters' })
  @MaxLength(120, { message: 'Model name must not exceed 120 characters' })
  name?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Brand ID must be a valid UUID' })
  brandId?: string | null;
}
