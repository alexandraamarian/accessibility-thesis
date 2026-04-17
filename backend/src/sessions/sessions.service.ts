import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const email = createSessionDto.email.toLowerCase().trim();

    // Check existing sessions for this email
    const existingSessions = await this.sessionsRepository.find({
      where: { participantId: email },
      order: { startedAt: 'ASC' },
    });

    // Enforce max 2 sessions per participant (one per condition)
    if (existingSessions.length >= 2) {
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
    let condition: 'adaptive' | 'control';
    if (existingSessions.length === 0) {
      condition = isAdaptiveFirst ? 'adaptive' : 'control';
    } else {
      // Give them the opposite condition from their first session
      const firstCondition = existingSessions[0].condition;
      condition = firstCondition === 'adaptive' ? 'control' : 'adaptive';
    }

    const session = this.sessionsRepository.create({
      participantId: email,
      condition,
      orderGroup,
    });
    return this.sessionsRepository.save(session);
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
    session.endedAt = new Date();
    return this.sessionsRepository.save(session);
  }
}
