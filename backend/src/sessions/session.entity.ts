import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { Adaptation } from '../adaptations/adaptation.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'participant_id' })
  participantId: string;

  @Column({ type: 'varchar', length: 20 })
  condition: 'adaptive' | 'control';

  @Column({ name: 'order_group', type: 'varchar', length: 20 })
  orderGroup: 'adaptive_first' | 'control_first';

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ name: 'sus_score', type: 'integer', nullable: true })
  susScore: number | null;

  @Column({ name: 'nasa_tlx', type: 'jsonb', nullable: true })
  nasaTlx: {
    mental?: number;
    physical?: number;
    temporal?: number;
    performance?: number;
    effort?: number;
    frustration?: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @OneToMany(() => Event, (event) => event.session)
  events: Event[];

  @OneToMany(() => Adaptation, (adaptation) => adaptation.session)
  adaptations: Adaptation[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
