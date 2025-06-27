import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/openai/entities/message.entity';
import { ChatService} from './chat.service';
import { ChatController} from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
