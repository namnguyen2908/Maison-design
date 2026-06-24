import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateAnnotationDto {
  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  x: number;

  @ApiProperty({ example: 32.1 })
  @IsNumber()
  @Min(0)
  @Max(100)
  y: number;

  @ApiPropertyOptional({ example: 'uuid-of-image' })
  @IsOptional()
  @IsUUID()
  targetImageId?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../reference.jpg' })
  @IsOptional()
  @IsString()
  referenceImageUrl?: string;
}
