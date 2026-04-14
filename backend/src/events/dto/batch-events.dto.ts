import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, IsISO8601, IsString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class EventDto {
  @ApiProperty({ example: '2024-03-07T12:00:00.000Z' })
  @IsISO8601()
  timestamp: string;

  @ApiProperty({ example: 'signal_snapshot' })
  @IsString()
  eventType: string;

  @ApiProperty({ type: 'object' })
  @IsObject()
  payload: Record<string, any>;
}

export class BatchEventsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ type: [EventDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
