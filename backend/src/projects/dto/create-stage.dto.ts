import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItem {
  @IsString()
  @IsNotEmpty()
  text: string;

  done: boolean;
}

export class CreateStageDto {
  @ApiProperty({ example: 'Khảo sát & Thu thập' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({
    type: [ChecklistItem],
    example: [{ text: 'Đã đo đạc', done: false }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItem)
  checklist?: ChecklistItem[];
}
