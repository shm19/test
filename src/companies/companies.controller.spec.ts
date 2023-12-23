/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AddCompanyDto } from './dto/add-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SetThresholdAndRangeDto } from './dto/set-threshold-range.dto';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  const mockCompaniesService = {
    findAll: jest.fn((req, type) => {
      return {};
    }),
    create: jest.fn((dto) => {
      return {
        id: (Math.random() + 1).toString(20),
        ...dto,
      };
    }),
    remove: jest.fn((id) => {
      return {};
    }),
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    upgradeCompany: jest.fn((req) => {
      return 'company upgraded';
    }),
    setThresholdsAndRange: jest.fn((req, dto) => {
      return { ...dto };
    }),
    getThresholdsAndRange: jest.fn(() => {}),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    })
      .overrideProvider(CompaniesService)
      .useValue(mockCompaniesService)
      .compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll companies unit tests', () => {
    it('should call findAll method of companies controller', async () => {
      const request = createRequest();
      const type = 'testType';
      const findAllCompaniesSpy = jest.spyOn(controller, 'findAll');
      await controller.findAll(request, type);
      expect(findAllCompaniesSpy).toHaveBeenCalled();
    });
    it('should return companies', async () => {
      const request = createRequest();
      const type = 'testType';
      expect(await controller.findAll(request, type)).not.toEqual(null);
    });
  });
  describe('create companies unit tests', () => {
    it('should call create method of companies controller', async () => {
      const createCompanySpy = jest.spyOn(controller, 'create');
      const dto = new AddCompanyDto();
      await controller.create(dto);
      expect(createCompanySpy).toHaveBeenCalledWith(dto);
    });
    it('should create company', async () => {
      const createCompanySpy = jest.spyOn(controller, 'create');
      const dto = new AddCompanyDto();
      await controller.create(dto);
      expect(createCompanySpy).not.toEqual(null);
    });
  });

  describe('remove companies unit tests', () => {
    it('should call remove method of companies controller', async () => {
      const removeCompanySpy = jest.spyOn(controller, 'remove');
      const id = '12345';
      await controller.remove(id);
      expect(removeCompanySpy).toHaveBeenCalled();
    });
    it('should remove company', async () => {
      const id = '12345';
      expect(await controller.remove(id)).not.toEqual(null);
    });
  });
  describe('update companies unit tests', () => {
    it('should call update method of companies controller', async () => {
      const updateCompanySpy = jest.spyOn(controller, 'update');
      const id = '6777';
      const dto = new UpdateCompanyDto();
      await controller.update(id, dto);
      expect(updateCompanySpy).toHaveBeenCalled();
    });
    it('should update a company', async () => {
      const id = '345';
      const dto = new UpdateCompanyDto();
      dto.email = 'test@test.com';
      dto.language = 'testLanguage';
      dto.name = 'testName';
      dto.status = 1;
      expect(await controller.update(id, dto)).toEqual({
        id: expect.any(String),
        ...dto,
      });
    });
    it('should update company', async () => {
      const dto = new UpdateCompanyDto();
      dto.email = 'test@gmail.com';
      const id = '456';
      expect(await controller.update(id, dto)).not.toEqual(null);
    });
  });
  describe('upgrade companies unit tests', () => {
    it('should call upgrade method of companies controller', async () => {
      const removeCompanySpy = jest.spyOn(controller, 'upgrade');
      const request = createRequest();
      await controller.upgrade(request);
      expect(removeCompanySpy).toHaveBeenCalled();
    });
  });
  describe('findOne companies unit tests', () => {
    it('should call upgrade method of companies controller', async () => {
      const findOneSpy = jest.spyOn(controller, 'findOne');
      const request = createRequest();
      await controller.findOne(request);
      expect(findOneSpy).toHaveBeenCalled();
    });
  });
  describe('setThresholdAndRange unit tests', () => {
    it('should call setThresholdAndRange method of companies controller', async () => {
      const setThresholdAndRange = jest.spyOn(
        controller,
        'setThresholdsAndRange',
      );
      const request = createRequest();
      const data = new SetThresholdAndRangeDto();
      await controller.setThresholdsAndRange(request, data);

      expect(setThresholdAndRange).toHaveBeenCalled();
    });

    it('should  set ThresholdAndRange', async () => {
      const data = new SetThresholdAndRangeDto();
      const request = createRequest();
      data.thresholds = {
        acc: [3, 4],
        height: [1, 1],
        zigzag: [1, 2],
        cableRemain: [4, 4],
        force: [1, 3],
        cross_distance: [1, 2],
        arc: [1, 5],
        f2: [2, 1],
      };
      data.ranges = {
        acc: [3, 4],
        height: [1, 1],
        zigzag: [1, 2],
        cableRemain: [4, 4],
        force: [1, 3],
        cross_distance: [1, 2],
        arc: [1, 5],
        f2: [2, 1],
      };
      expect(controller.setThresholdsAndRange(request, data)).not.toEqual(null);
    });
  });
  describe('getThresholdAndRange unit tests', () => {
    it('should call getThresholdAndRange method of companies controller', async () => {
      const getThresholdAndRange = jest.spyOn(
        controller,
        'getThresholdsAndRange',
      );
      const request = createRequest();
      await controller.getThresholdsAndRange(request);

      expect(getThresholdAndRange).toHaveBeenCalled();
    });
  });
});
