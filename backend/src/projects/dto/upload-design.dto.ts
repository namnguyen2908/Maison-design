import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadDesignDto {
  @ApiPropertyOptional({ example: 'Đã sửa màu gạch theo feedback #3' })
  @IsOptional()
  @IsString()
  notes?: string;
}
