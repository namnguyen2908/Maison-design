import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Maison Client' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ minLength: 8, example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  password: string;
}
