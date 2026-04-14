import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Adaptation } from '../adaptations/adaptation.entity';
import { Session } from '../sessions/session.entity';
import { BatchEventsDto } from './dto/batch-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Adaptation)
    private adaptationsRepository: Repository<Adaptation>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async batchCreate(batchEventsDto: BatchEventsDto): Promise<{ accepted: number; rejected: number }> {
    const { sessionId, events } = batchEventsDto;

    // Verify session exists
    const session = await this.sessionsRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const eventEntities = events.map((event) =>
      this.eventsRepository.create({
        sessionId,
        timestamp: new Date(event.timestamp),
        eventType: event.eventType,
        payload: event.payload,
      })
    );

    // Bulk insert events
    const savedEvents = await this.eventsRepository.save(eventEntities);

    // For adaptation_applied events, also create Adaptation records
    const adaptationEvents = events.filter((e) => e.eventType === 'adaptation_applied');

    if (adaptationEvents.length > 0) {
      const adaptations = adaptationEvents.map((event) =>
        this.adaptationsRepository.create({
          sessionId,
          ruleId: event.payload.ruleId,
          triggeredAt: new Date(event.timestamp),
          signalsSnapshot: event.payload.signals || {},
          uiStateBefore: event.payload.uiStateBefore || {},
          uiStateAfter: event.payload.uiStateAfter || {},
        })
      );

      await this.adaptationsRepository.save(adaptations);
    }

    return {
      accepted: savedEvents.length,
      rejected: 0,
    };
  }

  async findBySession(sessionId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  }
}
