/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { Setting } from './models/settings.model';
import { AddSettingDto } from './dto/add-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

describe('SettingsServiceTests', () => {
  let service: SettingsService;
  const mockSettingRepository = {
    addSetting: jest.fn().mockImplementation((dto) => dto),
    create: jest
      .fn()
      .mockImplementation((setting) =>
        Promise.resolve({ id: Date.now(), ...setting }),
      ),
    findByIdAndUpdate: jest
      .fn()
      .mockImplementation((id, dto) =>
        Promise.resolve({ id: Date.now(), ...dto }),
      ),
    findByIdAndRemove: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({})),
    findById: jest.fn().mockImplementation((id) => Promise.resolve({})),
    find: jest.fn().mockImplementation(() => Promise.resolve({})),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getModelToken(Setting.name),
          useValue: mockSettingRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create setting test cases', () => {
    it('it should call create new setting', async () => {
      const dto = new AddSettingDto();
      const createSettingSpy = jest.spyOn(service, 'create');
      await service.create(dto);
      expect(createSettingSpy).toHaveBeenCalledWith(dto);
    });
    it('should create a new Setting and return that', async () => {
      expect(
        await service.create({
          key: 'test',
          value: 1,
          description: 'test',
        }),
      ).toEqual({
        id: expect.any(Number),
        key: 'test',
        value: 1,
        description: 'test',
      });
    });
  });
  describe('update setting test', () => {
    it('should call update setting', async () => {
      const updateSettingSpy = jest.spyOn(service, 'update');
      const dto = new UpdateSettingDto();
      dto.description = 'test description';
      dto.key = 'testKey';
      dto.value = 5.4;
      const settingId = 'testId';
      await service.update(dto, settingId);
      expect(updateSettingSpy).toHaveBeenCalled();
    });
    it('should update setting', async () => {
      expect(
        await service.update(
          { key: 'test', value: 1, description: 'test' },
          '1',
        ),
      ).toEqual({
        id: expect.any(Number),
        key: 'test',
        value: 1,
        description: 'test',
      });
    });
  });
  describe('findOne setting tests', () => {
    it('should call findOne setting method', async () => {
      const findOneSettingSpy = jest.spyOn(service, 'findOne');
      await service.findOne('settingId');
      expect(findOneSettingSpy).toHaveBeenCalled();
    });
    it('should get a setting', async () => {
      const id = '123';
      expect(await service.findOne(id)).not.toEqual(null);
    });
  });
  describe('findAll setting tests', () => {
    it('should call findAll setting method.', async () => {
      const allSettingSpy = jest.spyOn(service, 'findAll');
      await service.findAll();
      expect(allSettingSpy).toHaveBeenCalled();
    });
  });

  describe('remove setting tests', () => {
    it('should call remove setting method.', async () => {
      const removeSettingSpy = jest.spyOn(service, 'remove');
      const id = 'testId';
      await service.remove(id);
      expect(removeSettingSpy).toHaveBeenCalled();
    });
    it('should remove a setting', async () => {
      const id = 'test123';
      expect(await service.remove(id)).not.toEqual(null);
    });
  });
});
