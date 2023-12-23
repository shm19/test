/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Account } from '../accounts/models/account.model';
import { CompaniesService } from '../companies/companies.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockAccountsRepositroy = {
    create: jest.fn().mockImplementation(),
  };
  const mockJwtService = {};
  const mockCompaniesService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Account.name),
          useValue: { mockAccountsRepositroy },
        },
        CompaniesService,
        JwtService,
      ],
    })
      .overrideProvider(CompaniesService)
      .useValue(mockCompaniesService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
