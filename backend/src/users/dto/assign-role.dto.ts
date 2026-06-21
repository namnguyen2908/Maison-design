import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ example: 'designer' })
  @IsString()
  @IsNotEmpty()
  roleName: string;
}
