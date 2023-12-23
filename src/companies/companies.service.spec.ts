/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { createRequest } from 'node-mocks-http';
import { CompaniesService } from './companies.service';
import { Company } from './models/company.model';
import { Account } from '../accounts/models/account.model';
import { AddCompanyDto } from './dto/add-company.dto';
import { ContactPersonDto } from './dto/contact-person.dto';
import { PhoneDto } from '../auth/dto/phone.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SetThresholdAndRangeDto } from './dto/set-threshold-range.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  const mockCompaniesRepository = {
    findAll: jest.fn((req, type) => {
      return Promise.resolve([{}]);
    }),
    findById: jest.fn((id) => {
      return Promise.resolve({});
    }),
    create: jest.fn((dto) => {
      return Promise.resolve({
        id: (Math.random() + 1).toString(20),
        ...dto,
      });
    }),
    findByIdAndUpdate: jest.fn((id, dto) => {
      return Promise.resolve({ id, ...dto });
    }),
    findByIdAndDelete: jest.fn((id) => {
      return Promise.resolve({});
    }),
    aggregate: jest.fn((agg) => {
      return [{ members: [] }];
    }),
    findOneAndUpdate: jest.fn((id, dto) => {
      return Promise.resolve({ id, ...dto });
    }),
  };
  const mockAccountRepository = {
    findById: jest.fn((id) => {
      return Promise.resolve({
        selectedCompany: {
          _id: '644257d8b7b73b0012a084ed',
        },
      });
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompaniesRepository,
        },
        {
          provide: getModelToken(Account.name),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll companies unit tests', () => {
    it('should call findAll method of companies service', async () => {
      const request = createRequest();
      request.user = { userId: '1234' };
      const type = 'testType';
      const findAllCompaniesSpy = jest.spyOn(service, 'findAll');
      await service.findAll(request, type);
      expect(findAllCompaniesSpy).toHaveBeenCalled();
    });
    it('should return companies', async () => {
      const request = createRequest();
      request.user = { userId: '1234' };
      const type = 'testType';
      expect(await service.findAll(request, type)).not.toEqual(null);
    });
  });
  describe('create companies unit tests', () => {
    it('should call create method of companies service', async () => {
      const createCompanySpy = jest.spyOn(service, 'create');
      const dto = new AddCompanyDto();
      await service.create(dto);
      expect(createCompanySpy).toHaveBeenCalled();
    });
    it('should create a company', async () => {
      const dto = new AddCompanyDto();
      dto.name = 'testName';
      const contactPerson = new ContactPersonDto();
      contactPerson.firstName = 'testName';
      contactPerson.lastName = 'testLastName';
      contactPerson.email = 'test@gmail.com';
      const phoneDto = new PhoneDto();
      phoneDto.countryCode = '34';
      phoneDto.realNumber = '44433';
      contactPerson.phoneNumber = phoneDto;
      dto.contactPerson = contactPerson;
      expect(await service.create(dto)).not.toEqual(null);
    });
  });

  describe('updateStatus companies unit tests', () => {
    it('should call updateStatus method of companies service', async () => {
      const updateStatusCompaniesSpy = jest.spyOn(service, 'updateStatus');
      const updateStatus = new ChangeStatusDto();
      await service.updateStatus(updateStatus, '123');
      expect(updateStatusCompaniesSpy).toHaveBeenCalled();
    });
    it('should update status of a company', async () => {
      const updateStatus = new ChangeStatusDto();
      updateStatus.status = 1;
      expect(service.updateStatus(updateStatus, '1234')).not.toEqual(null);
    });
  });
  describe('remove companies unit tests', () => {
    it('should remove a company', async () => {
      expect(service.remove('123')).not.toEqual(null);
    });
  });
  describe('update companies unit tests', () => {
    it('should call update method', async () => {
      const updateCompanySpy = jest.spyOn(service, 'update');
      const updateCompanyDto = new UpdateCompanyDto();
      await service.update('12345', updateCompanyDto);
      expect(updateCompanySpy).toHaveBeenCalled();
    });
    it('should update a comapany', async () => {
      const updateCompanyDto = new UpdateCompanyDto();
      updateCompanyDto.email = 'test@mail.com';
      updateCompanyDto.language = 'english';
      updateCompanyDto.website = 'test.com';
      updateCompanyDto.name = 'testCompany';
      expect(service.update('123', updateCompanyDto)).toEqual(
        Promise.resolve({
          ...updateCompanyDto,
          id: expect.any(String),
        }),
      );
    });
  });
  describe('getCompanyById of companies service unit tests', () => {
    it('should get a company', async () => {
      expect(service.getCompanyById('123')).toEqual(Promise.resolve({}));
    });
  });
  describe('findOne of companies service unit tests', () => {
    it('it should call findOne method of companies service', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');
      await service.findOne('12345');
      expect(findOneSpy).toHaveBeenCalled();
    });
    it('should get a company', async () => {
      expect(service.findOne('123')).toEqual(Promise.resolve({}));
    });
  });
  describe('setThresholdsAndRange of companies service unit tests', () => {
    it('it should call setThresholdsAndRange method of companies service', async () => {
      const request = createRequest();
      request.query.company = { _id: '644257d8b7b73b0012a084ed' };
      const setThresholdAndRangeDto = new SetThresholdAndRangeDto();
      const setThresholdAndRange = jest.spyOn(service, 'setThresholdsAndRange');
      await service.setThresholdsAndRange(request, setThresholdAndRangeDto);
      expect(setThresholdAndRange).toHaveBeenCalled();
    });
  });
  describe('getThresholdsAndRange of companies service unit tests', () => {
    it('it should call getThresholdsAndRange method of companies service', async () => {
      const request = createRequest();
      request.query.company = { _id: '644257d8b7b73b0012a084ed' };
      const getThresholdAndRange = jest.spyOn(service, 'getThresholdsAndRange');
      await service.getThresholdsAndRange(request);
      expect(getThresholdAndRange).toHaveBeenCalled();
    });
  });
});
