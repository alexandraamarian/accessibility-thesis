import { Injectable, NotFoundException } from '@nestjs/common';
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
    const session = this.sessionsRepository.create(createSessionDto);
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
