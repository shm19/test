/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Account } from 'src/accounts/models/account.model';
import { EmailOptionsDto } from 'src/accounts/email/Dto/email-options.dto';
import { Company } from './models/company.model';
import { AddCompanyDto } from './dto/add-company.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { sendEmail } from '../accounts/email';
import { Thresholds } from './models/thresholds.model';
import { Ranges } from './models/ranges.model';
import { SetThresholdAndRangeDto } from './dto/set-threshold-range.dto';
import { normalizeCompany } from './middlewares/authorization.middleware';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel('Company') private companyModel: Model<Company>,
    @InjectModel('Account') private accountModel: Model<Account>,
  ) {}

  // todo
  async findAll(@Request() req, type: string): Promise<any> {
    const userId = req.user.userId;
    const account = await this.accountModel.findById(userId);
    const { selectedCompany } = account;
    const role = req.user.role;
    const companyId = new mongoose.Types.ObjectId(selectedCompany._id);
    const pipeline = [
      {
        $match: { _id: companyId },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: 'companies.companyId',
          as: 'members',
        },
      },
    ];

    if (role === 'super_admin') {
      pipeline.shift();
    }
    let companies = await this.companyModel.aggregate(pipeline);
    companies = companies.map((c) => normalizeCompany(c));

    if (role !== 'super_admin') {
      companies = companies.filter((c) => c.status === 1);
    }

    if (type === 'basic') {
      companies = companies.map((company) => ({
        _id: company._id,
        name: company.name,
      }));
    }
    return companies;
  }

  async create(data: AddCompanyDto): Promise<Company> {
    const company = await this.companyModel.create(data);
    if (company) {
      return company;
    }
    throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async updateStatus(data: ChangeStatusDto, id: string): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, data);
    if (updatedCompany) {
      return updatedCompany;
    }
    throw new NotFoundException('Company not found.');
  }

  async remove(id: string): Promise<Company> {
    const deletedCompany = await this.companyModel.findByIdAndDelete(id);
    if (deletedCompany) {
      return deletedCompany;
    }
    throw new NotFoundException('Comapany not found');
  }

  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, data);
    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    } else {
      return updatedCompany;
    }
  }

  async getCompanyById(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id);
    if (company) return company;
    throw new NotFoundException('Company not found');
  }

  async findOne(id: string): Promise<Company> {
    const company = this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async upgradeCompany(@Request() req): Promise<any> {
    const account = await this.accountModel.findById(req.user.userId);
    const superAdmins = [
      'amir@panto.org',
      'mehdi@panto.org',
      'farzad@panto.org',
      'morteza@panto.org',
    ];
    const company = req.query.company;
    if (!account || !company) {
      throw new BadRequestException('Account or company not found');
    }
    const companyName = company.name;
    const fullName = `${account.firstName} ${account.lastName}`;
    const phoneNumber = `${company.contactPerson.phoneNumber.countryCode} ${company.contactPerson.phoneNumber.realNumber}`;
    const options: EmailOptionsDto = {
      to: superAdmins.join(','),
      html: `
        <p>We have new upgrade company request for <b>${companyName}</b> from <b>${fullName}</b></p>
        <p>Contact number: <a href="tel:${phoneNumber}">${phoneNumber}</a></p>
      `,
      from: { name: `${companyName}` },
      subject: 'Company upgrade',
      attachments: undefined,
      password: '',
      text: '',
    };
    sendEmail(options);
    return 'Upgrade email has sent';
  }

  async setThresholdsAndRange(
    @Request() req,
    data: SetThresholdAndRangeDto,
  ): Promise<any> {
    const { company } = req.query;
    const { thresholds, ranges } = data;
    const savedCompany = await this.companyModel.findOneAndUpdate(
      { _id: company._id },
      {
        $set: {
          ranges,
          thresholds,
        },
      },
      {
        new: true,
      },
    );
    // const { thresholdsResponse, rangesResponse } =
    //   this.convertThresholdsAndRanges(
    //     savedCompany.thresholds,
    //     savedCompany.ranges,
    //   );
    // const result = { thresholds: thresholdsResponse, ranges: rangesResponse };
    return 'result';
  }

  async getThresholdsAndRange(@Request() req): Promise<any> {
    const { company } = req.query;
    const { thresholds, ranges } = company;
    const { thresholdsResponse, rangesResponse } =
      this.convertThresholdsAndRanges(thresholds, ranges);
    const result = {
      thresholds: thresholdsResponse,
      ranges: rangesResponse,
    };
    return result;
  }

  convertThresholdsAndRanges(thresholds: Thresholds, ranges: Ranges) {
    const types = [
      'acc',
      'height',
      'zigzag',
      'cableRemain',
      'force',
      'cross_distance',
      'arc',
      'f2',
    ];
    const getPropertyValue = (obj, key) =>
      obj && key in obj ? obj[key] : [null, null];
    const thresholdsResponse = {};
    const rangesResponse = {};

    types.forEach((e) => {
      thresholdsResponse[e] = getPropertyValue(thresholds, e);
      rangesResponse[e] = getPropertyValue(ranges, e);
    });
    return {
      thresholdsResponse,
      rangesResponse,
    };
  }
}
