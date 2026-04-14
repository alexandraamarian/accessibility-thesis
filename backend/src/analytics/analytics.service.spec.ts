import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Session } from '../sessions/session.entity';

const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  describe('getSessionAnalytics', () => {
    it('should return analytics for a valid session', async () => {
      const session = {
        id: 'uuid-1',
        participantId: 'P001',
        condition: 'adaptive',
        orderGroup: 'adaptive_first',
        startedAt: new Date(),
        endedAt: null,
        susScore: 75,
        nasaTlx: { mental: 5 },
        events: [
          { eventType: 'signal_snapshot', payload: { signals: { zoomCount: 1 } } },
          { eventType: 'task_completed', payload: { duration: 30 } },
        ],
        adaptations: [{ ruleId: 'font_scale', triggeredAt: new Date() }],
      };
      mockRepository.findOne.mockResolvedValue(session);

      const result = await service.getSessionAnalytics('uuid-1');

      expect(result).toBeDefined();
      expect(result.session.id).toBe('uuid-1');
      expect(result.signalSnapshots).toHaveLength(1);
      expect(result.taskMetrics).toHaveLength(1);
      expect(result.adaptations).toHaveLength(1);
    });

    it('should return null for nonexistent session', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getSessionAnalytics('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getSummaryStatistics', () => {
    it('should compute summary stats across sessions', async () => {
      const sessions = [
        {
          condition: 'adaptive',
          susScore: 80,
          endedAt: new Date(),
          adaptations: [{ id: 1 }, { id: 2 }],
        },
        {
          condition: 'adaptive',
          susScore: 70,
          endedAt: new Date(),
          adaptations: [{ id: 3 }],
        },
        {
          condition: 'control',
          susScore: 60,
          endedAt: null,
          adaptations: [],
        },
      ];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.getSummaryStatistics();

      expect(result.totalSessions).toBe(3);
      expect(result.completedSessions).toBe(2);
      expect(result.byCondition.adaptive.count).toBe(2);
      expect(result.byCondition.adaptive.meanSUS).toBe(75);
      expect(result.byCondition.adaptive.meanAdaptations).toBe(1.5);
      expect(result.byCondition.control.count).toBe(1);
      expect(result.byCondition.control.meanSUS).toBe(60);
    });
  });

  describe('exportCSV', () => {
    it('should generate CSV with headers', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            participantId: 'P001',
            id: 'uuid-1',
            condition: 'adaptive',
            orderGroup: 'adaptive_first',
            startedAt: new Date('2024-01-01'),
            endedAt: new Date('2024-01-01T01:00:00'),
            susScore: 75,
            nasaTlx: { mental: 5, physical: 2, temporal: 3, performance: 4, effort: 3, frustration: 2 },
            events: [],
            adaptations: [],
          },
        ]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQb);

      const csv = await service.exportCSV();

      expect(csv).toContain('participant_id');
      expect(csv).toContain('sus_score');
      expect(csv).toContain('P001');
    });

    it('should return empty string for no data', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQb);

      const csv = await service.exportCSV();

      expect(csv).toBe('');
    });
  });
});
