import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-messge.dto';
import { User } from 'src/decorators/user.decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageEntity } from './entities/message.entity';

@Controller('/api/chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':roomId')
  @ApiOperation({ summary: 'AI 채팅 생성' })
  @ApiBody({
    schema: {
      example: {
        userMessage: '나는 요즘 우울한데 우울증 극복 방법을 알려줄 수 있을까?',
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        statusCode: 201,
        message: 'AI 응답 생성 성공',
        data: {
          id: 1,
          userMessage: '나는 요즘 우울한데...',
          aiResponse: 'AI 응답내용',
        },
      },
    },
  })
  async createChat(
    @Param('roomId') roomId: number,
    @Body() dto: CreateMessageDto,
    @User() user,
  ): Promise<{ statusCode: number; message: string; data: MessageResponseDto }> {
    const saved = await this.chatService.chat(dto, user.id, roomId);
    return {
      statusCode: 201,
      message: 'AI 응답 생성 성공',
      data: saved,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: '나의 채팅 내역 조회' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: '채팅 조회 성공',
        data: {
          id: 1,
          userMessage: '나는 요즘...',
          aiResponse: 'AI 응답내용',
        },
      },
    },
  })
  async getOneChat(
    @Param('id') id: number,
    @User() user,
  ): Promise<{ statusCode: number; message: string; data: MessageResponseDto }> {
    const chat = await this.chatService.findOneChat(id, user.id);
    return {
      statusCode: 200,
      message: '채팅 조회 성공',
      data: chat,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '내 채팅 전체 조회'})
  async getAllChat(@User() user) : Promise<{ statusCode: number, message: string, data: MessageEntity[]}> {
    const chats = await this.chatService.findAllChat(user.id);
    return {
      statusCode: 200,
      message: '채팅 전체 조회 성공',
      data: chats
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '특정 채팅 삭제' })
  @ApiResponse({ status: 204, description: '채팅 삭제 성공' })
  async deleteChat(@Param('id') id: number, @User() user): Promise<void> {
    await this.chatService.deleteChat(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: '나의 전체 채팅 삭제' })
  @ApiResponse({ status: 204, description: '전체 채팅 삭제 성공' })
  async deleteAllChat(@User() user): Promise<void> {
    await this.chatService.deleteAllChat(user.id);
  }
}
