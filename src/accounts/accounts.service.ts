import {
  BadRequestException,
  NotFoundException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/accounts/models/account.model';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ChangeThemeDto } from './dto/change-theme.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Email } from './email/model/email.model';
import { sendEmail } from './email/index';
import { PasswordResetDto } from './dto/password-reset.dto';
import { UpdateAccountDto } from './dto/update.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('Account') private accountModel: Model<Account>,
    @InjectModel('Email') private emailModel: Model<Email>,
  ) {}

  async changeTheme(id: string, data: ChangeThemeDto): Promise<Account> {
    const changedTheme = await this.accountModel.findByIdAndUpdate(id, data);
    if (!changedTheme) {
      throw new NotFoundException('Account not found');
    }
    return changedTheme;
  }

  async changeLanguage(id: string, data: ChangeLanguageDto): Promise<Account> {
    const changedLanguage = await this.accountModel.findByIdAndUpdate(id, data);
    if (!changedLanguage) {
      throw new NotFoundException('Account not found');
    }
    return changedLanguage;
  }

  async deleteAccount(id: string): Promise<Account> {
    const deletedAccount = await this.accountModel.findByIdAndDelete(id);
    if (!deletedAccount) {
      throw new NotFoundException('Account not found');
    }
    return deletedAccount;
  }

  async updatePassword(id: string, data: UpdatePasswordDto): Promise<Account> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Please repeat password correctly');
    }
    const account = await this.accountModel.findById(id);

    const isPasswordCorrect = await bcrypt.compare(
      data.currentPassword,
      account.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }
    account.password = data.password;
    await account.save();
    return account;
  }

  async getAccount(id: string) {
    const account = await this.accountModel
      .findById(id)
      .populate('selectedCompany');
    const selectedCompany = account.companies.find(
      // eslint-disable-next-line no-underscore-dangle
      (c) => String(c.companyId) === String(account.selectedCompany._id),
    );
    const data = {
      language: account.language,
      lastOnline: account.lastOnline,
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phoneNumber: account.phoneNumber,
      role: selectedCompany.role,
      access: selectedCompany.access,
      position: selectedCompany.position,
      company: {
        // eslint-disable-next-line no-underscore-dangle
        id: account.selectedCompany._id,
        // eslint-disable-next-line dot-notation
        name: account.selectedCompany['name'],
      },
    };
    return data;
  }

  async getAllAccounts(role: string, userId: string) {
    const isSuperAdmin = role === 'super_admin';
    const company = await this.accountModel.findById(userId);
    const query = { 'companies.companyId': company.selectedCompany };
    const accounts = await this.accountModel
      .find(isSuperAdmin ? {} : query)
      .sort({
        lastOnline: -1,
      })
      .populate('selectedCompany');
    const count = accounts.length;
    const data = accounts.map((account) => {
      const selectedCompany = account.companies.find(
        // eslint-disable-next-line no-underscore-dangle
        (c) => String(c.companyId) === String(account.selectedCompany._id),
      );
      return {
        language: account.language,
        lastOnline: account.lastOnline,
        username: account.username,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        role: selectedCompany.role,
        access: selectedCompany.access,
        position: selectedCompany.position,
        company: {
          // eslint-disable-next-line no-underscore-dangle
          id: account.selectedCompany._id,
          // eslint-disable-next-line dot-notation
          name: account.selectedCompany['name'],
        },
      };
    });
    const finalData = {
      count,
      data,
    };
    return finalData;
  }

  // eslint-disable-next-line consistent-return
  async forgotPassword(data: ForgotPasswordDto) {
    const account = await this.accountModel.findOne({ email: data.email });
    if (!account) {
      throw new BadRequestException('Account Not Found');
    }
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      account.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      account.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await account.save({ validateBeforeSave: false });
      const options = {
        to: account.email,
        html: `
        <p>Your Token:</p>
        <p>${resetToken}</p>`,
        from: { name: 'PANTOhealth' },
        subject: 'Reset Password',
        attachments: undefined,
        password: '',
        text: '',
      };
      sendEmail(options);
      this.emailModel.create({
        to: options.to,
        text: options.text || options.html,
        subject: options.subject,
        status: 10000,
        attachments: options.attachments,
      });
      return { ok: true, message: 'Password reset sent to email' };
    } catch (err) {
      account.passwordResetToken = undefined;
      account.passwordResetExpiresAt = undefined;
      await account.save({ validateBeforeSave: false });
    }
  }

  async resetPassword(token: string, data: PasswordResetDto) {
    if (data.password !== data.passwordConfirm) {
      throw new BadRequestException('Please repeat password correctly');
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const account = await this.accountModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: Date.now() },
    });
    if (!account) {
      throw new UnauthorizedException('Token is invalid or has expired');
    }
    account.password = data.password;
    account.passwordResetToken = undefined;
    account.passwordResetExpiresAt = undefined;
    await account.save();
    return { ok: true, message: 'Password successfully updated' };
  }

  async updateAccount(id: string, data: UpdateAccountDto) {
    const account = await this.accountModel.findByIdAndUpdate(id, data);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }
}
