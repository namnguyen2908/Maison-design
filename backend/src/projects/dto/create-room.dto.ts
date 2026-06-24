import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Phòng khách' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}
