import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'participant@example.com' })
  @IsEmail()
  email: string;
}
