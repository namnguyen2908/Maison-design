import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StageStatus } from '../entities/project-stage.entity';

class ChecklistItem {
  @IsString()
  text: string;

  done: boolean;
}

export class UpdateStageDto {
  @ApiPropertyOptional({ example: 'Khảo sát & Thu thập' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ enum: StageStatus })
  @IsOptional()
  @IsEnum(StageStatus)
  status?: StageStatus;

  @ApiPropertyOptional({
    type: [ChecklistItem],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItem)
  checklist?: ChecklistItem[];
}
