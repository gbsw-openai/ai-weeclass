import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from 'src/openai/entities/message.entity';
import { CreateMessageDto } from './dto/create-messge.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { AccessDiniedException, ChatNotFoundException } from 'src/exception/service.exception';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;
  private readonly prompt: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.prompt = this.configService.get('OPENAI_PROMPT');
  }

  async chat(
    createmessagedto: CreateMessageDto, 
    userId: number, 
    roomId: number
  ): Promise<MessageResponseDto> {
    const { userMessage } = createmessagedto;
  
    // 1. 이전 대화 불러오기 (roomId 기준, 시간순 정렬, 최근 10개)
    const previousChats = await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
      take: 20, //20개만 기억
    });
  
    // 2. 메시지 배열 구성 (system 프롬프트 + 이전 대화들 + 현재 메시지)
    const messages = [
      { role: 'system', content: this.prompt },
      ...previousChats.flatMap(chat => {
        // 이전 대화 한 쌍(userMessage + aiResponse) 처리
        // userMessage는 user 역할, aiResponse는 assistant 역할
        const msgs = [];
        if (chat.userMessage) {
          msgs.push({ role: 'user', content: chat.userMessage });
        }
        if (chat.aiResponse) {
          msgs.push({ role: 'assistant', content: chat.aiResponse });
        }
        return msgs;
      }),
      { role: 'user', content: userMessage },
    ];
  
    const chatCompletion = await this.openai.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      messages,
      max_tokens: 500,
      temperature: 0.4,
    });
  
    const aiResponse = chatCompletion.choices[0].message.content;

    const counsel = this.messageRepository.create({
      aiResponse,
      userId,
      userMessage,
      roomId,
    });
  
    const saved = await this.messageRepository.save(counsel);
  
    return {
      id: saved.id,
      userMessage: saved.userMessage,
      aiResponse: saved.aiResponse,
    };
  }
  

  async findOneChat(id: number, userId: number): Promise<MessageEntity> {
    const chat = await this.messageRepository.findOne({ where: { id } });
  
    if (!chat) {
      throw ChatNotFoundException('채팅을 찾을 수 없습니다.');
    }
  
    if (chat.userId !== userId) {
      throw AccessDiniedException('자신의 채팅만 조회 가능합니다.');
    }

    return chat;
  }
  
  async findAllChat(userId: number): Promise<MessageEntity[]> {
    return await this.messageRepository.find({
      where: { userId }
    })
  }

  async deleteChat(id: number, userId: number): Promise<void> {
    const chat = await this.findOneChat(id, userId);

    if(chat.userId !== userId) {
      throw AccessDiniedException('채팅을 삭제할 권한이 없습니다.');
    }

    await this.messageRepository.delete(id);
  }

  async deleteAllChat(userId: number): Promise<void> {
    await this.messageRepository.delete({ userId });
  }
}
