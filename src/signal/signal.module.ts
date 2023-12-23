import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { Signal, SignalSchema } from './entities/signal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Signal.name,
        schema: SignalSchema,
      },
    ]),
  ],
  controllers: [SignalController],
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
