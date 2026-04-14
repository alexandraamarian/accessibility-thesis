import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../sessions/session.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async getSessionAnalytics(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId },
      relations: ['events', 'adaptations'],
    });

    if (!session) {
      return null;
    }

    const signalSnapshots = session.events.filter((e) => e.eventType === 'signal_snapshot');
    const taskEvents = session.events.filter((e) => e.eventType === 'task_completed');

    return {
      session: {
        id: session.id,
        participantId: session.participantId,
        condition: session.condition,
        orderGroup: session.orderGroup,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        susScore: session.susScore,
        nasaTlx: session.nasaTlx,
      },
      signalSnapshots: signalSnapshots.map((e) => e.payload),
      adaptations: session.adaptations,
      taskMetrics: taskEvents.map((e) => e.payload),
    };
  }

  async exportCSV(participantIds?: string[]): Promise<string> {
    const query = this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.events', 'event')
      .leftJoinAndSelect('session.adaptations', 'adaptation');

    if (participantIds?.length) {
      query.where('session.participantId IN (:...ids)', { ids: participantIds });
    }

    const sessions = await query.getMany();

    const rows = sessions.map((session) => {
      const signalSnapshots = session.events
        .filter((e) => e.eventType === 'signal_snapshot')
        .map((e) => e.payload.signals || e.payload);

      const taskEvents = session.events.filter((e) => e.eventType === 'task_completed');

      // Calculate averages from signal snapshots
      const avgZoomCount = this.average(signalSnapshots.map((s) => s.zoomCount || 0));
      const avgMissedTapRate = this.average(signalSnapshots.map((s) => s.missedTapRate || 0));
      const avgDwellSeconds = this.average(signalSnapshots.map((s) => s.avgDwellSeconds || 0));
      const avgScrollReversalRate = this.average(
        signalSnapshots.map((s) => s.scrollReversalRate || 0)
      );
      const avgTremorScore = this.average(signalSnapshots.map((s) => s.tremorScore || 0));

      // Calculate task metrics
      const avgTaskDuration = this.average(taskEvents.map((e) => e.payload.duration || 0));
      const totalErrors = taskEvents.reduce((sum, e) => sum + (e.payload.errors || 0), 0);

      // First adaptation timing
      const firstAdaptation = session.adaptations.length > 0 ? session.adaptations[0] : null;
      const firstAdaptationTime = firstAdaptation
        ? (new Date(firstAdaptation.triggeredAt).getTime() -
            new Date(session.startedAt).getTime()) /
          1000
        : null;

      return {
        participant_id: session.participantId,
        session_id: session.id,
        condition: session.condition,
        order_group: session.orderGroup,
        started_at: session.startedAt.toISOString(),
        ended_at: session.endedAt ? session.endedAt.toISOString() : null,
        sus_score: session.susScore,
        nasa_tlx_mental: session.nasaTlx?.mental || null,
        nasa_tlx_physical: session.nasaTlx?.physical || null,
        nasa_tlx_temporal: session.nasaTlx?.temporal || null,
        nasa_tlx_performance: session.nasaTlx?.performance || null,
        nasa_tlx_effort: session.nasaTlx?.effort || null,
        nasa_tlx_frustration: session.nasaTlx?.frustration || null,
        adaptation_count: session.adaptations.length,
        first_adaptation_time: firstAdaptationTime,
        zoom_count_avg: avgZoomCount,
        missed_tap_rate_avg: avgMissedTapRate,
        dwell_seconds_avg: avgDwellSeconds,
        scroll_reversal_rate_avg: avgScrollReversalRate,
        tremor_score_avg: avgTremorScore,
        task_duration_avg: avgTaskDuration,
        task_errors_total: totalErrors,
      };
    });

    return this.jsonToCSV(rows);
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  async getSummaryStatistics() {
    const sessions = await this.sessionsRepository.find({
      relations: ['adaptations'],
      order: { startedAt: 'DESC' },
    });

    const adaptive = sessions.filter((s) => s.condition === 'adaptive');
    const control = sessions.filter((s) => s.condition === 'control');

    const avg = (nums: number[]) => nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

    const adaptiveSUS = adaptive.map((s) => s.susScore).filter((v): v is number => v !== null);
    const controlSUS = control.map((s) => s.susScore).filter((v): v is number => v !== null);

    return {
      totalSessions: sessions.length,
      completedSessions: sessions.filter((s) => s.endedAt).length,
      byCondition: {
        adaptive: {
          count: adaptive.length,
          meanSUS: avg(adaptiveSUS),
          meanAdaptations: avg(adaptive.map((s) => s.adaptations?.length || 0)),
        },
        control: {
          count: control.length,
          meanSUS: avg(controlSUS),
        },
      },
    };
  }

  private jsonToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((v) => {
          if (v === null || v === undefined) return '';
          if (typeof v === 'string') return `"${v.replace(/"/g, '""')}"`;
          return v;
        })
        .join(',')
    );

    return [headers, ...rows].join('\n');
  }
}
