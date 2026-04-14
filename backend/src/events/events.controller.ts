import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { BatchEventsDto } from './dto/batch-events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('batch')
  @ApiOperation({ summary: 'Batch insert events from frontend' })
  @ApiResponse({ status: 201, description: 'Events created successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  batchCreate(@Body() batchEventsDto: BatchEventsDto) {
    return this.eventsService.batchCreate(batchEventsDto);
  }
}
