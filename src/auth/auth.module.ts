/* eslint-disable class-methods-use-this */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account, AccountSchema } from '../accounts/models/account.model';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    PassportModule,
    JwtModule,
    CompaniesModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
