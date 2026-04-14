import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { Adaptation } from '../adaptations/adaptation.entity';
import { Session } from '../sessions/session.entity';

const mockEventRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockAdaptationRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockSessionRepo = {
  findOne: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Event), useValue: mockEventRepo },
        { provide: getRepositoryToken(Adaptation), useValue: mockAdaptationRepo },
        { provide: getRepositoryToken(Session), useValue: mockSessionRepo },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  describe('batchCreate', () => {
    it('should create events for a valid session', async () => {
      const session = { id: 'uuid-1' };
      mockSessionRepo.findOne.mockResolvedValue(session);

      const events = [
        { timestamp: '2024-01-01T00:00:00.000Z', eventType: 'signal_snapshot', payload: { zoomCount: 1 } },
      ];
      const eventEntity = { id: 1, ...events[0] };
      mockEventRepo.create.mockReturnValue(eventEntity);
      mockEventRepo.save.mockResolvedValue([eventEntity]);

      const result = await service.batchCreate({ sessionId: 'uuid-1', events });

      expect(result.accepted).toBe(1);
      expect(result.rejected).toBe(0);
    });

    it('should throw NotFoundException for invalid session', async () => {
      mockSessionRepo.findOne.mockResolvedValue(null);

      await expect(
        service.batchCreate({
          sessionId: 'nonexistent',
          events: [{ timestamp: '2024-01-01T00:00:00.000Z', eventType: 'signal_snapshot', payload: {} }],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create adaptation records for adaptation_applied events', async () => {
      const session = { id: 'uuid-1' };
      mockSessionRepo.findOne.mockResolvedValue(session);

      const events = [
        {
          timestamp: '2024-01-01T00:00:00.000Z',
          eventType: 'adaptation_applied',
          payload: {
            ruleId: 'font_scale',
            signals: { zoomCount: 3 },
            uiStateBefore: { fontSize: 16 },
            uiStateAfter: { fontSize: 18 },
          },
        },
      ];

      const eventEntity = { id: 1, ...events[0] };
      const adaptationEntity = { id: 1, ruleId: 'font_scale' };

      mockEventRepo.create.mockReturnValue(eventEntity);
      mockEventRepo.save.mockResolvedValue([eventEntity]);
      mockAdaptationRepo.create.mockReturnValue(adaptationEntity);
      mockAdaptationRepo.save.mockResolvedValue([adaptationEntity]);

      await service.batchCreate({ sessionId: 'uuid-1', events });

      expect(mockAdaptationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ ruleId: 'font_scale' }),
      );
      expect(mockAdaptationRepo.save).toHaveBeenCalled();
    });

    it('should not create adaptation records for non-adaptation events', async () => {
      const session = { id: 'uuid-1' };
      mockSessionRepo.findOne.mockResolvedValue(session);

      const events = [
        { timestamp: '2024-01-01T00:00:00.000Z', eventType: 'signal_snapshot', payload: {} },
      ];

      const eventEntity = { id: 1, ...events[0] };
      mockEventRepo.create.mockReturnValue(eventEntity);
      mockEventRepo.save.mockResolvedValue([eventEntity]);

      await service.batchCreate({ sessionId: 'uuid-1', events });

      expect(mockAdaptationRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('findBySession', () => {
    it('should return events ordered by timestamp', async () => {
      const events = [{ id: 1 }, { id: 2 }];
      mockEventRepo.find.mockResolvedValue(events);

      const result = await service.findBySession('uuid-1');

      expect(mockEventRepo.find).toHaveBeenCalledWith({
        where: { sessionId: 'uuid-1' },
        order: { timestamp: 'ASC' },
      });
      expect(result).toEqual(events);
    });
  });
});
