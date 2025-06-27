import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/openai/entities/message.entity';
import { RoomEntity } from 'src/room/entities/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChatService } from 'src/openai/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, RoomEntity, UserEntity])],
  providers: [RoomService, UserService, ChatService, AuthService, JwtService],
  controllers: [RoomController]
})
export class RoomModule {}
