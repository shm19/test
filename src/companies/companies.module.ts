/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/accounts/models/account.model';
import { CompanySchema, Company } from './models/company.model';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [CompaniesService],
  exports: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('companies/:id');
  }
}
