import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Event } from '../events/event.entity';
import { Adaptation } from '../adaptations/adaptation.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Adaptation)
    private adaptationsRepository: Repository<Adaptation>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session & { sessionIndex: number }> {
    const email = createSessionDto.email.toLowerCase().trim();

    // Check existing sessions for this email
    const existingSessions = await this.sessionsRepository.find({
      where: { participantId: email },
      order: { startedAt: 'ASC' },
    });

    // Fix ALL sessions that have all scores but missing endedAt (user closed after NASA-TLX)
    const needEndedAt = existingSessions.filter(
      (s) => !s.endedAt && s.susScore != null && s.nasaTlx != null,
    );
    for (const s of needEndedAt) {
      s.endedAt = new Date();
      await this.sessionsRepository.save(s);
    }

    // Re-fetch after potential fixes
    const currentSessions = needEndedAt.length > 0
      ? await this.sessionsRepository.find({ where: { participantId: email }, order: { startedAt: 'ASC' } })
      : existingSessions;

    // Find the first truly incomplete session (missing scores)
    const firstIncompleteIndex = currentSessions.findIndex(
      (s) => s.susScore == null || s.nasaTlx == null,
    );

    if (firstIncompleteIndex !== -1) {
      // If session 1 is incomplete, delete ALL sessions and reset from scratch
      // (session 2 data is invalid without a proper session 1)
      // If session 2 is incomplete, only reset session 2
      const isFirstSession = firstIncompleteIndex === 0;
      const toDelete = currentSessions.slice(isFirstSession ? 0 : 1);

      // Delete all sessions from the incomplete one onward
      for (const s of toDelete) {
        await this.eventsRepository.delete({ sessionId: s.id });
        await this.adaptationsRepository.delete({ sessionId: s.id });
        await this.sessionsRepository.delete({ id: s.id });
      }

      // Determine condition for the reset session
      const hash = email
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isAdaptiveFirst = hash % 2 === 0;
      const orderGroup = isAdaptiveFirst ? 'adaptive_first' : 'control_first';

      let condition: 'adaptive' | 'control';
      if (isFirstSession) {
        condition = isAdaptiveFirst ? 'adaptive' : 'control';
      } else {
        // Redoing session 2 — opposite of completed session 1
        condition = currentSessions[0].condition === 'adaptive' ? 'control' : 'adaptive';
      }

      const session = this.sessionsRepository.create({
        participantId: email,
        condition,
        orderGroup,
      });
      const saved = await this.sessionsRepository.save(session);
      return { ...saved, sessionIndex: isFirstSession ? 0 : 1 };
    }

    // All existing sessions are complete — enforce max 2
    if (currentSessions.length >= 2) {
      throw new ConflictException(
        'This email has already completed both study sessions. Each participant may only participate twice (once per condition).'
      );
    }

    // Determine counterbalancing group from email hash
    const hash = email
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isAdaptiveFirst = hash % 2 === 0;
    const orderGroup = isAdaptiveFirst ? 'adaptive_first' : 'control_first';

    // First session gets the first condition, second session gets the other
    const completedSessions = currentSessions.filter((s) => s.endedAt);
    let condition: 'adaptive' | 'control';
    if (completedSessions.length === 0) {
      condition = isAdaptiveFirst ? 'adaptive' : 'control';
    } else {
      const firstCondition = completedSessions[0].condition;
      condition = firstCondition === 'adaptive' ? 'control' : 'adaptive';
    }

    const sessionIndex = completedSessions.length;
    const session = this.sessionsRepository.create({
      participantId: email,
      condition,
      orderGroup,
    });
    const saved = await this.sessionsRepository.save(session);
    return { ...saved, sessionIndex };
  }

  async findAll(participantId?: string): Promise<Session[]> {
    const where = participantId ? { participantId } : {};
    return this.sessionsRepository.find({
      where,
      order: { startedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ['events', 'adaptations'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);

    if (updateSessionDto.susScore !== undefined) {
      session.susScore = updateSessionDto.susScore;
    }

    if (updateSessionDto.nasaTlx !== undefined) {
      session.nasaTlx = updateSessionDto.nasaTlx;
    }

    if (updateSessionDto.metadata !== undefined) {
      session.metadata = { ...session.metadata, ...updateSessionDto.metadata };
    }

    return this.sessionsRepository.save(session);
  }

  async endSession(id: string): Promise<Session> {
    const session = await this.findOne(id);
    if (!session.endedAt) {
      session.endedAt = new Date();
      return this.sessionsRepository.save(session);
    }
    return session;
  }
}
