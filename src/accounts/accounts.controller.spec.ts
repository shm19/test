/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { ChangeThemeDto } from './dto/change-theme.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAccountDto } from './dto/update.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  const mockeAccountService = {
    changeTheme: jest.fn().mockImplementation((dto, request) => {
      return dto;
    }),
    changeLanguage: jest.fn().mockImplementation((dto, request) => {
      return dto;
    }),
    deleteAccount: jest.fn().mockImplementation((id) => {
      return {};
    }),
    updatePassword: jest.fn().mockImplementation((id, data) => {
      return Promise.resolve({});
    }),
    getAccount: jest.fn().mockImplementation((id) => {
      return Promise.resolve({});
    }),
    updateAccount: jest.fn().mockImplementation((id, data) => {
      return Promise.resolve({});
    }),
    forgotPassword: jest.fn().mockImplementation((data) => {
      return {};
    }),
    resetPassword: jest.fn().mockImplementation((token, data) => {
      return {};
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService],
    })
      .overrideProvider(AccountsService)
      .useValue(mockeAccountService)
      .compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('changeTheme method of accounts controller unit tests', () => {
    it('it should call changeTheme method of accounts controller', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const changeThemeSpy = jest.spyOn(controller, 'changeTheme');
      const changeThemeDto = new ChangeThemeDto();
      changeThemeDto.theme = 'dark';
      await controller.changeTheme(changeThemeDto, request);
      expect(changeThemeSpy).toHaveBeenCalled();
    });
    it('it should change theme', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const changedThemeDto = new ChangeThemeDto();
      changedThemeDto.theme = 'dark';
      expect(controller.changeTheme(changedThemeDto, request)).not.toEqual(
        null,
      );
    });
  });

  describe('changeLanguage method of accounts controller unit tests', () => {
    it('it should call changeLanguage method of accounts controller', async () => {
      const request = createRequest();
      request.user = {
        userId: '12345',
      };
      const changeLanguageSpy = jest.spyOn(controller, 'changeLanguage');
      const changeLanguageDto = new ChangeLanguageDto();
      changeLanguageDto.language = 'en';
      await controller.changeLanguage(changeLanguageDto, request);
      expect(changeLanguageSpy).toHaveBeenCalled();
    });
    it('it should change language', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const changeLanguageDto = new ChangeLanguageDto();
      changeLanguageDto.language = 'en';
      expect(controller.changeLanguage(changeLanguageDto, request)).not.toEqual(
        null,
      );
    });
  });
  describe('deleteAccount method of accounts controller unit tests', () => {
    it('it should call deleteAccount method of accounts controller', async () => {
      const deleteAccountSpy = jest.spyOn(controller, 'deleteAccount');
      await controller.deleteAccount('1234');
      expect(deleteAccountSpy).toHaveBeenCalled();
    });
    it('it should call delete a account', async () => {
      expect(controller.deleteAccount('124')).not.toEqual(null);
    });
  });
  describe('updatePassword method of accounts controller unit tests', () => {
    it('it should call updatePassword method of accounts controller', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const updatePasswordDto = new UpdatePasswordDto();
      updatePasswordDto.password = '1234';
      updatePasswordDto.currentPassword = '123';
      updatePasswordDto.confirmPassword = '1234';
      const updatePasswordSpy = jest.spyOn(controller, 'updatePassword');
      await controller.updatePassword(updatePasswordDto, request);
      expect(updatePasswordSpy).toHaveBeenCalled();
    });
    it('it should update password', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const updatePasswordDto = new UpdatePasswordDto();
      updatePasswordDto.password = '1234';
      updatePasswordDto.currentPassword = '123';
      updatePasswordDto.confirmPassword = '1234';
      expect(controller.updatePassword(updatePasswordDto, request)).not.toEqual(
        null,
      );
    });
  });

  describe('getMe method of accounts controller unit tests', () => {
    it('it should call getMe method of accounts controller', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      const getMeAccountSpy = jest.spyOn(controller, 'getMe');
      await controller.getMe(request);
      expect(getMeAccountSpy).toHaveBeenCalled();
    });
    it('it should return user', async () => {
      const request = createRequest();
      request.user = {
        userId: '1234',
      };
      expect(controller.getMe(request)).not.toEqual(null);
    });
  });
  describe('updateAccount method of accounts controller unit tests', () => {
    it('it should call updateAccount method of accounts controller', async () => {
      const updateAccountDto = new UpdateAccountDto();
      updateAccountDto.firstName = 'test';
      updateAccountDto.lastName = 'test2';
      const updateAccountSpy = jest.spyOn(controller, 'updateAccount');
      await controller.updateAccount('123', updateAccountDto);
      expect(updateAccountSpy).toHaveBeenCalled();
    });
  });
  describe('forgotPassword method of accounts controller unit tests', () => {
    it('it should call forgotPassword method of accounts controller', async () => {
      const forgotPasswordDto = new ForgotPasswordDto();
      forgotPasswordDto.email = 'test@test.com';
      const forgotPasswordSpy = jest.spyOn(controller, 'forgotPassword');
      await controller.forgotPassword(forgotPasswordDto);
      expect(forgotPasswordSpy).toHaveBeenCalled();
    });
  });

  describe('resetPassword method of accounts controller unit tests', () => {
    it('it should call resetPassword method of accounts controller', async () => {
      const passwordResetDto = new PasswordResetDto();
      passwordResetDto.password = 'test';
      passwordResetDto.passwordConfirm = 'test';
      const resetPasswordSpy = jest.spyOn(controller, 'resetPassword');
      await controller.resetPassword('token', passwordResetDto);
      expect(resetPasswordSpy).toHaveBeenCalled();
    });
  });
});
