import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from '../accounts/models/account.model';
import { Account } from '../accounts/models/account.model';
import { Email } from './email/model/email.model';
import { EmailSchema } from './email/model/email.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
