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

      // Calculate averages and maxes from signal snapshots
      const avg = (arr: number[]) => this.average(arr);
      const max = (arr: number[]) => arr.length > 0 ? Math.max(...arr) : 0;
      const last = (arr: number[]) => arr.length > 0 ? arr[arr.length - 1] : 0;

      const zoomCounts = signalSnapshots.map((s) => s.zoomCount || 0);
      const missedTapRates = signalSnapshots.map((s) => s.missedTapRate || 0);
      const dwellSecs = signalSnapshots.map((s) => s.avgDwellSeconds || 0);
      const scrollRevRates = signalSnapshots.map((s) => s.scrollReversalRate || 0);
      const tremorScores = signalSnapshots.map((s) => s.tremorScore || 0);
      const rageClicks = signalSnapshots.map((s) => s.rageClickCount || 0);
      const hesitations = signalSnapshots.map((s) => s.mouseHesitationScore || 0);
      const idles = signalSnapshots.map((s) => s.idleSeconds || 0);
      const readingSpeeds = signalSnapshots.map((s) => s.readingSpeed || 0);
      const keyboardNavCounts = signalSnapshots.map((s) => s.keyboardNavCount || 0);
      const totalTaps = signalSnapshots.map((s) => s.totalTaps || 0);
      const totalScrollChanges = signalSnapshots.map((s) => s.totalScrollChanges || 0);

      // Calculate task metrics — overall and per type
      const avgTaskDuration = avg(taskEvents.map((e) => e.payload.duration || 0));
      const totalErrors = taskEvents.reduce((sum, e) => sum + (e.payload.errors || 0), 0);

      const tasksByType = (type: string) => taskEvents.filter((e) => (e.payload.taskType || e.payload.type) === type);
      const findTasks = tasksByType('find_answer');
      const formTasks = tasksByType('form_completion');
      const navTasks = tasksByType('navigation');

      // Session total duration in seconds
      const sessionDurationSeconds = session.endedAt
        ? (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
        : null;

      // First adaptation timing
      const firstAdaptation = session.adaptations.length > 0 ? session.adaptations[0] : null;
      const firstAdaptationTime = firstAdaptation
        ? (new Date(firstAdaptation.triggeredAt).getTime() -
            new Date(session.startedAt).getTime()) /
          1000
        : null;

      // Extract demographics and device info from session metadata
      const demographics = session.metadata?.demographics || {};
      const device = session.metadata?.deviceInfo || {};

      return {
        participant_id: session.participantId,
        session_id: session.id,
        condition: session.condition,
        order_group: session.orderGroup,
        age_range: demographics.ageRange || null,
        gender: demographics.gender || null,
        disability: demographics.hasDisability || null,
        assistive_tech: demographics.assistiveTech || null,
        computer_proficiency: demographics.computerProficiency || null,
        screen_width: device.screenWidth || null,
        screen_height: device.screenHeight || null,
        input_type: device.inputType || null,
        touch_support: device.touchSupport ?? null,
        user_agent: device.userAgent || null,
        article_set_id: session.metadata?.articleSetId || null,
        open_ended_feedback: session.metadata?.openEndedFeedback || null,
        started_at: session.startedAt.toISOString(),
        ended_at: session.endedAt ? session.endedAt.toISOString() : null,
        sus_score: session.susScore,
        // Normalize NASA-TLX to 1-10 scale (old sessions stored 0-100)
        nasa_tlx_mental: this.normalizeNasa(session.nasaTlx?.mental),
        nasa_tlx_physical: this.normalizeNasa(session.nasaTlx?.physical),
        nasa_tlx_temporal: this.normalizeNasa(session.nasaTlx?.temporal),
        // Performance is reverse-scored: high raw = good, invert so higher = more workload (consistent with other dimensions)
        nasa_tlx_performance: this.normalizeNasa(session.nasaTlx?.performance, true),
        nasa_tlx_effort: this.normalizeNasa(session.nasaTlx?.effort),
        nasa_tlx_frustration: this.normalizeNasa(session.nasaTlx?.frustration),
        session_duration_seconds: sessionDurationSeconds,
        adaptation_count: session.adaptations.length,
        adaptation_rules: session.adaptations.map((a) => a.ruleId).join(';') || null,
        first_adaptation_time: firstAdaptationTime,
        signal_snapshot_count: signalSnapshots.length,
        // Signal averages
        zoom_count_avg: avg(zoomCounts),
        missed_tap_rate_avg: avg(missedTapRates),
        dwell_seconds_avg: avg(dwellSecs),
        scroll_reversal_rate_avg: avg(scrollRevRates),
        tremor_score_avg: avg(tremorScores),
        rage_click_count_avg: avg(rageClicks),
        mouse_hesitation_score_avg: avg(hesitations),
        idle_seconds_avg: avg(idles),
        reading_speed_avg: avg(readingSpeeds),
        keyboard_nav_count_avg: avg(keyboardNavCounts),
        // Signal maximums (peak difficulty moments)
        zoom_count_max: max(zoomCounts),
        missed_tap_rate_max: max(missedTapRates),
        dwell_seconds_max: max(dwellSecs),
        scroll_reversal_rate_max: max(scrollRevRates),
        tremor_score_max: max(tremorScores),
        rage_click_count_max: max(rageClicks),
        mouse_hesitation_score_max: max(hesitations),
        idle_seconds_max: max(idles),
        reading_speed_min: readingSpeeds.length > 0 ? Math.min(...readingSpeeds.filter((v) => v > 0)) || 0 : 0,
        // Totals (last snapshot holds cumulative values)
        total_taps: last(totalTaps),
        total_scroll_changes: last(totalScrollChanges),
        keyboard_nav_count_total: last(keyboardNavCounts),
        // Per-task-type breakdown
        task_duration_avg: avgTaskDuration,
        task_errors_total: totalErrors,
        find_answer_duration: avg(findTasks.map((e) => e.payload.duration || 0)) || null,
        find_answer_errors: findTasks.reduce((s, e) => s + (e.payload.errors || 0), 0),
        form_completion_duration: avg(formTasks.map((e) => e.payload.duration || 0)) || null,
        form_completion_errors: formTasks.reduce((s, e) => s + (e.payload.errors || 0), 0),
        navigation_duration: avg(navTasks.map((e) => e.payload.duration || 0)) || null,
        navigation_errors: navTasks.reduce((s, e) => s + (e.payload.errors || 0), 0),
      };
    });

    return this.jsonToCSV(rows);
  }

  private normalizeNasa(value: number | null | undefined, reverseScore = false): number | null {
    if (value == null) return null;
    const normalized = value > 10 ? Math.round(value / 10) : value;
    return reverseScore ? 10 - normalized : normalized;
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
