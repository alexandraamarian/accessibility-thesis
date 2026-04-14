import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('events')
@Index(['sessionId', 'timestamp'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.events)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'event_type', type: 'varchar', length: 50 })
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;
}
