/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Account } from 'src/accounts/models/account.model';
import { RegisterDto } from 'src/auth/dto/register.dto';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Account') private accountModel: Model<Account>,
    private companyService: CompaniesService,
    private jwtService: JwtService,
  ) {}

  async getAccountById(accountId: string): Promise<Account> {
    const existingAccount = await this.accountModel.findById(accountId).exec();
    if (existingAccount) return existingAccount;
    throw new NotFoundException('Account not found');
  }

  async register(data: RegisterDto): Promise<any> {
    const { companyId } = data;
    const account = await this.accountModel.findOne({
      userName: data.username,
    });
    if (account) {
      const isMemberOfThisCompany = (await account).companies.find(
        (company) => {
          company.companyId.toString() === companyId;
        },
      );
      if (isMemberOfThisCompany) {
        throw new BadRequestException(
          'Account already is a member of this company',
        );
      }

      account.companies.push({
        companyId: new Schema.Types.ObjectId(companyId),
        role: data.role,
        access: data.access,
        position: data.position,
      });
      account.save();
      return account;
    }
    // if there is not any account
    const newAccount = {
      ..._.omit(data, ['role', 'access', 'position']),
      password: data.password,
      selectedCompany: companyId,
      companies: [
        {
          companyId,
          role: data.role,
          access: data.access,
          position: data.position,
        },
      ],
    };
    const createdAccount = await this.accountModel.create(newAccount);
    const selectedCompany = createdAccount.companies.find(
      (c) => String(c.companyId) === String(createdAccount.selectedCompany),
    );
    return {
      data: _.omit(
        {
          ...createdAccount.toObject(),
          role: selectedCompany.role,
          access: selectedCompany.access,
          position: selectedCompany.position,
        },
        ['companies', 'selectedCompany'],
      ),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const account = await this.accountModel.findOne({ email: username });
    if (account && account.password === pass) {
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async login(data: LoginDto, ip: string): Promise<string> {
    const { email, password } = data;
    const account = await this.accountModel
      .findOne({ email })
      .select(['password', 'selectedCompany', 'companies']);
    if (!account) {
      throw new BadRequestException('User not found');
    }
    const { knownIp } = account;
    if (knownIp === undefined) {
      account.knownIp = ip;
      await account.save();
    } else if (knownIp !== ip) {
      throw new BadRequestException('Please login with your own Ip');
    }
    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect || !password) {
      throw new BadRequestException(
        'Please provide correct email and password ',
      );
    }

    const selectedCompany = await this.companyService.getCompanyById(
      account.selectedCompany.toHexString(),
    );
    if (selectedCompany.status === 2) {
      throw new BadRequestException('Company is disabled');
    }
    const { role } = account.companies[0];
    const token = await this.jwtService.sign(
      // eslint-disable-next-line no-underscore-dangle
      { userId: account._id, username: account.email, role },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXP_H,
      },
    );
    return token;
  }
}
