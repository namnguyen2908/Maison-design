import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Thiết kế chung cư Rose Town' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Thiết kế nội thất căn hộ 90m2' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  clientEmail: string;

  @ApiPropertyOptional({ example: 'designer@example.com' })
  @IsOptional()
  @IsEmail()
  assignedDesignerEmail?: string;
}
