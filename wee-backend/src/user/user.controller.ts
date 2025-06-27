import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({
    schema: {
      example: {
        username: 'suhwan3116',
        password: 'hwan1234@',
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: '회원가입이 완료되었습니다.',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<{ statusCode: number, message: string}>{
    await this.userService.createUser(createUserDto);

    return {
      statusCode: 200,
      message: '회원가입이 완료되었습니다.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 한명 조회' })
  async getOneUser(@Param('id') id: number){
    const user = await this.userService.getOneUser(id);
    return user;
  }
}
