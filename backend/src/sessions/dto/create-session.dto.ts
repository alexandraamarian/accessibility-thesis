import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'P001' })
  @IsString()
  participantId: string;

  @ApiProperty({ enum: ['adaptive', 'control'], example: 'adaptive' })
  @IsIn(['adaptive', 'control'])
  condition: 'adaptive' | 'control';

  @ApiProperty({ enum: ['adaptive_first', 'control_first'], example: 'adaptive_first' })
  @IsIn(['adaptive_first', 'control_first'])
  orderGroup: 'adaptive_first' | 'control_first';
}
