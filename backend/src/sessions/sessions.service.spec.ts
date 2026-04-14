import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from './session.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a session', async () => {
      const dto = {
        participantId: 'P001',
        condition: 'adaptive' as const,
        orderGroup: 'adaptive_first' as const,
      };
      const session = { id: 'uuid-1', ...dto };

      mockRepository.create.mockReturnValue(session);
      mockRepository.save.mockResolvedValue(session);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(session);
      expect(result).toEqual(session);
    });
  });

  describe('findAll', () => {
    it('should return all sessions ordered by startedAt DESC', async () => {
      const sessions = [
        { id: '1', participantId: 'P001' },
        { id: '2', participantId: 'P002' },
      ];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { startedAt: 'DESC' },
      });
      expect(result).toEqual(sessions);
    });

    it('should filter by participantId when provided', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findAll('P001');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { participantId: 'P001' },
        order: { startedAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a session with relations', async () => {
      const session = { id: 'uuid-1', participantId: 'P001' };
      mockRepository.findOne.mockResolvedValue(session);

      const result = await service.findOne('uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        relations: ['events', 'adaptations'],
      });
      expect(result).toEqual(session);
    });

    it('should throw NotFoundException when session not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update susScore', async () => {
      const session = { id: 'uuid-1', susScore: null, nasaTlx: null, metadata: null };
      mockRepository.findOne.mockResolvedValue(session);
      mockRepository.save.mockResolvedValue({ ...session, susScore: 75 });

      const result = await service.update('uuid-1', { susScore: 75 });

      expect(result.susScore).toBe(75);
    });

    it('should update nasaTlx', async () => {
      const session = { id: 'uuid-1', susScore: null, nasaTlx: null, metadata: null };
      const nasaTlx = { mental: 5, physical: 2, temporal: 3, performance: 4, effort: 3, frustration: 2 };
      mockRepository.findOne.mockResolvedValue(session);
      mockRepository.save.mockResolvedValue({ ...session, nasaTlx });

      const result = await service.update('uuid-1', { nasaTlx });

      expect(result.nasaTlx).toEqual(nasaTlx);
    });

    it('should merge metadata', async () => {
      const session = { id: 'uuid-1', susScore: null, nasaTlx: null, metadata: { key1: 'val1' } };
      mockRepository.findOne.mockResolvedValue(session);
      mockRepository.save.mockImplementation((s) => Promise.resolve(s));

      await service.update('uuid-1', { metadata: { key2: 'val2' } });

      expect(session.metadata).toEqual({ key1: 'val1', key2: 'val2' });
    });
  });

  describe('endSession', () => {
    it('should set endedAt timestamp', async () => {
      const session = { id: 'uuid-1', endedAt: null };
      mockRepository.findOne.mockResolvedValue(session);
      mockRepository.save.mockImplementation((s) => Promise.resolve(s));

      const result = await service.endSession('uuid-1');

      expect(result.endedAt).toBeInstanceOf(Date);
    });
  });
});
