import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { LoggerModule } from './logger/logger.module';
import { Environment } from './types/environment';

import { DeviceDataModule } from './device-data/device-data.module';
import { CustomValidationPipe } from './common/custom-validation.pipe';
import { MyLoggerService } from './logger/myLogger.service';
import { DeviceModule } from './device/device.module';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { SignalModule } from './signal/signal.module';
import { EventModule } from './event/event.module';
import { SettingModule } from './setting/setting.module';
import { JwtStrategy } from './auth/jwt.strategy';

const getEnvFilePath = (): string =>
  process.env.NODE_ENV === Environment.Development ? 'development.env' : '.env';

const getMongoUrl = (configService: ConfigService): string =>
  process.env.NODE_ENV === Environment.Development
    ? 'mongodb://localhost:27017/panto-api'
    : configService.get<string>('MONGO_URL');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = getMongoUrl(configService);
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot(),
    DeviceDataModule,
    DeviceModule,
    SignalModule,
    EventModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService,
    {
      provide: APP_PIPE,
      useFactory: (loggerService: MyLoggerService) => {
        const options = {
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        };
        return new CustomValidationPipe(loggerService, options);
      },
      inject: [MyLoggerService],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
  ],
})
export class AppModule {}
