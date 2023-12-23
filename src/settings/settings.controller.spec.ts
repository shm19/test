/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AddSettingDto } from './dto/add-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

describe('SettingsControllerTest', () => {
  let controller: SettingsController;
  const mockSettingsService = {
    create: jest.fn((dto) => {
      return {
        id: (Math.random() + 1).toString(20),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    remove: jest.fn().mockImplementation((id) => {
      return {};
    }),
    findOne: jest.fn().mockImplementation(() => {
      return {};
    }),
    findAll: jest.fn().mockImplementation(() => {
      return [{}];
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService],
    })
      .overrideProvider(SettingsService)
      .useValue(mockSettingsService)
      .compile();

    controller = module.get<SettingsController>(SettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create setting unit tests', () => {
    it('shoul call create setting method', async () => {
      const createSettingSpy = jest.spyOn(controller, 'create');
      const dto = new AddSettingDto();
      await controller.create(dto);
      expect(createSettingSpy).toHaveBeenCalledWith(dto);
    });
    it('should create a setting', () => {
      expect(
        controller.create({
          key: 'test',
          value: 10,
          description: 'test',
        }),
      ).toEqual({
        id: expect.any(String),
        key: 'test',
        value: 10,
        description: 'test',
      });
      expect(mockSettingsService.create).toHaveBeenCalledWith({
        key: 'test',
        value: 10,
        description: 'test',
      });
    });
  });

  describe('update setting unit tests', () => {
    it('should call update setting', async () => {
      const dto = new UpdateSettingDto();
      dto.key = 'testKey';
      dto.value = 34;
      const settingId = '345';
      const updateSettingSpy = jest.spyOn(controller, 'update');
      await controller.update(settingId, dto);
      expect(updateSettingSpy).toHaveBeenCalled();
    });
    it('should update setting', () => {
      const dto = { key: 'test', description: 'test', value: 10 };
      expect(mockSettingsService.update('1', dto)).toEqual({
        id: expect.any(String),
        key: 'test',
        description: 'test',
        value: 10,
      });
    });
  });
  describe('remove setting unit tests', () => {
    it('should call remove setting method', async () => {
      const settingId = '123';
      const removeSettingSpy = jest.spyOn(controller, 'remove');
      await controller.remove(settingId);
      expect(removeSettingSpy).toHaveBeenCalled();
    });
    it('should remove a setting', async () => {
      const settingId = '12345';
      expect(controller.remove(settingId)).not.toEqual(null);
    });
  });
  describe('findOne setting unit tests', () => {
    it('should call findOne setting method', async () => {
      const findOneSettingSpy = jest.spyOn(controller, 'findOne');
      await controller.findOne('testId');
      expect(findOneSettingSpy).toHaveBeenCalled();
    });
  });
  describe('findAll setting unit tests', () => {
    it('should return settings', async () => {
      expect(await controller.findAll).not.toEqual(null);
    });
  });
});
