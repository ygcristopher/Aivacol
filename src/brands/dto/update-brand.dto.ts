import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBrandDto {
  @IsOptional()
  @IsString({ message: 'Brand name must be a string' })
  @MinLength(2, { message: 'Brand name must be at least 2 characters' })
  @MaxLength(100, { message: 'Brand name must not exceed 100 characters' })
  name?: string;
}
