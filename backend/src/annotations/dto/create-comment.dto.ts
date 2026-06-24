import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Đổi màu gạch sang xám đen' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
