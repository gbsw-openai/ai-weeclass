import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ChatModule } from './openai/chat.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        retryAttempts: configService.get('NODE_ENV') === 'prod' ? 10 : 1,
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        entities: [path.join(__dirname, '../**/*.entity.{js, ts}')],
        synchronize: true,
        logging: true,
        timezone: 'local',
      }),
    }),
    UserModule,
    ChatModule,
    AuthModule,
    RoomModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}