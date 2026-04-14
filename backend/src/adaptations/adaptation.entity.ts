import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('adaptations')
@Index(['sessionId', 'ruleId'])
export class Adaptation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.adaptations)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'rule_id', type: 'varchar', length: 50 })
  ruleId: string;

  @Column({ name: 'triggered_at', type: 'timestamp' })
  triggeredAt: Date;

  @Column({ name: 'signals_snapshot', type: 'jsonb' })
  signalsSnapshot: Record<string, any>;

  @Column({ name: 'ui_state_before', type: 'jsonb' })
  uiStateBefore: Record<string, any>;

  @Column({ name: 'ui_state_after', type: 'jsonb' })
  uiStateAfter: Record<string, any>;
}
