import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Account } from './models/account.model';
import { Email } from './email/model/email.model';
import { ChangeThemeDto } from './dto/change-theme.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAccountDto } from './dto/update.dto';
describe('AccountsService', () => {
  let service: AccountsService;
  const mockAccountsRepositroy = {
    findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => {
      return Promise.resolve({});
    }),
    findByIdAndDelete: jest.fn().mockImplementation((id) => {
      return Promise.resolve({});
    }),
    findById: jest.fn().mockImplementation((id) => {
      return { password: '12345' };
    }),
    save: jest.fn().mockImplementation((dto) => {
      return {};
    }),
    populate: jest.fn().mockImplementation(() => {}),
  };
  const mockEmailRepositroy = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account.name),
          useValue: mockAccountsRepositroy,
        },
        {
          provide: getModelToken(Email.name),
          useValue: mockEmailRepositroy,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('change theme method of accounts service unit tests', () => {
    it('it should call changeTheme method of accounts service', async () => {
      const changeThemeDto = new ChangeThemeDto();
      const chageThemeSpy = jest.spyOn(service, 'changeTheme');
      const id = '123';
      await service.changeTheme(id, changeThemeDto);
      expect(chageThemeSpy).toHaveBeenCalled();
    });
    it('it should  change Theme', async () => {
      const id = '12345';
      const changedThemeDto = new ChangeThemeDto();
      changedThemeDto.theme = 'dark';
      expect(await service.changeTheme(id, changedThemeDto)).not.toEqual(null);
    });
  });
  describe('change language method of accounts service unit tests', () => {
    it('it should call change language method of accounts service', async () => {
      const changeLanguageDto = new ChangeLanguageDto();
      changeLanguageDto.language = 'De';
      const chageLanguageSpy = jest.spyOn(service, 'changeLanguage');
      const id = '123';
      await service.changeLanguage(id, changeLanguageDto);
      expect(chageLanguageSpy).toHaveBeenCalled();
    });
    it('it should change language', async () => {
      const id = '12345';
      const changedLanguageDto = new ChangeLanguageDto();
      changedLanguageDto.language = 'en';
      expect(await service.changeLanguage(id, changedLanguageDto)).toEqual({});
    });
  });

  describe('delete account method of accounts service unit tests', () => {
    it('it should call delete account method of accounts service', async () => {
      const deleteAccountSpy = jest.spyOn(service, 'deleteAccount');
      const id = '123';
      await service.deleteAccount(id);
      expect(deleteAccountSpy).toHaveBeenCalled();
    });
    it('it should delete account', async () => {
      const id = '12345';
      expect(await service.deleteAccount(id)).toEqual({});
    });
  });

  describe('update-password method of accounts service unit tests', () => {
    it('it should call update-password method of accounts service', async () => {
      const updatePasswordSpy = jest.spyOn(service, 'updatePassword');
      const updatePasswordDto = new UpdatePasswordDto();
      updatePasswordDto.currentPassword = '12345';
      updatePasswordDto.password = '1234';
      updatePasswordDto.confirmPassword = '1234';
      await service.updatePassword('1234', updatePasswordDto);
      expect(updatePasswordSpy).toThrowError();
    });
  });
  describe('getAccount method of accounts service unit tests', () => {
    it('it should call getAccount method of accounts service', async () => {
      const getAccountSpy = jest.spyOn(service, 'getAccount');
      await service.getAccount('1234');
      expect(getAccountSpy).toThrowError();
    });
  });
  describe('updateAccount method of accounts service unit tests', () => {
    it('it should call updateAccount method of accounts service', async () => {
      const updateAccountSpy = jest.spyOn(service, 'updateAccount');
      const updateAccountDto = new UpdateAccountDto();
      await service.updateAccount('124', updateAccountDto);
      expect(updateAccountSpy).toHaveBeenCalled();
    });
  });
});
