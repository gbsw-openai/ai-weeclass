import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateAccessTokenByRefreshToken } from './dto/create-AccessTokenByRefreshToekn.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      example: {
        username: 'suhwan3118',
        password: 'hwan1234@',
      },
    },
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: '잘못된 입력값입니다.',
      },
    },
  })
  async logIn(@Body() createUserDTO: CreateUserDto) {
    const user = await this.authService.validateUser(createUserDTO);
    const tokens = await this.authService.logIn(user);
    return tokens;
  }

  @Post('/login/token')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBody({
    schema: {
      example: {
        refreshToken: 'ey.....',
      },
    },
  })
  async refreshToken(
    @Body() dto: CreateAccessTokenByRefreshToken,
  ) {
    const tokens = await this.authService.refreshAccessToken(dto);
    return tokens;
  }
}
