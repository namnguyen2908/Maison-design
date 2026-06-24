import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AnnotationStatus } from '../entities/annotation.entity';

export class UpdateAnnotationStatusDto {
  @ApiProperty({ enum: AnnotationStatus })
  @IsEnum(AnnotationStatus)
  status: AnnotationStatus;
}
