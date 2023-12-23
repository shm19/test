/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import _ from 'lodash';
import { Company } from '../models/company.model';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(@InjectModel('Company') private companyModel: Model<Company>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const companyId = new mongoose.Types.ObjectId(id);
    const company = await this.companyModel.aggregate([
      {
        $match: { _id: companyId },
      },
      {
        $lookup: {
          from: 'accounts',
          pipeline: [
            {
              $match: { 'companies.companyId': companyId },
            },
            {
              $project: {
                _id: 1,
                companies: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                lastOnline: 1,
                phoneNumber: 1,
                selectedCompany: 1,
                username: 1,
              },
            },
          ],
          as: 'members',
        },
      },
    ]);
    if (company.length === 0) {
      req.query.company = undefined;
      next();
    }

    req.query.company = normalizeCompany(company[0]);
    next();
  }
}

export function normalizeCompany(company: any): any {
  const finalCompany = { ...company, members: [] };
  company.members.forEach((member) => {
    const selectedCompany = member.companies.find(
      (c) => String(c.companyId) === String(member.selectedCompany),
    );

    member.role = selectedCompany.role;
    member.access = selectedCompany.access;
    member.position = selectedCompany.position;

    finalCompany.members.push(_.omit(member, ['companies', 'selectedCompany']));
  });

  return finalCompany;
}
