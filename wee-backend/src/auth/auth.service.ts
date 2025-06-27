import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateAccessTokenByRefreshToken } from './dto/create-AccessTokenByRefreshToekn.dto';
import { InvalidInputException, InvalidTokenException, UserNotFoundException } from 'src/exception/service.exception';
import { accessTokenRequest } from './dto/accessToken-request.dto';
import { ConfigService } from '@nestjs/config';

interface JwtPayloadCustom {
  id: number;
  username?: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async signToken(payload: JwtPayloadCustom, isRefresh = false): Promise<string> {
    return this.jwtService.sign(
      { ...payload, type: isRefresh ? 'refresh' : 'access' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: isRefresh ? '7d' : '1d',
      },
    );
  }

  public async validateUser(accessTokenRequest: accessTokenRequest): Promise<{ id: number; username: string }> {
    const { username, password } = accessTokenRequest;
    
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw InvalidInputException('잘못된 입력값입니다.');
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw InvalidInputException('잘못된 입력값입니다.');
    }

    return { id: user.id, username: user.username };
  }

  public async logIn(user: JwtPayloadCustom): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.signToken(user, false);
    const refreshToken = await this.signToken(user, true);
    
    return { accessToken, refreshToken };
  }

  public async decodeToken(token: string): Promise<JwtPayloadCustom> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'), // ✅ 명시적으로 전달
      }) as JwtPayloadCustom;
    } catch (error) {
      throw InvalidTokenException('유효하지 않은 토큰입니다.');
    }
  }

  public async refreshAccessToken(dto: CreateAccessTokenByRefreshToken): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { refreshToken } = dto;
    const payload = await this.decodeToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw InvalidTokenException('유효하지 않은 토큰입니다.');
    }
  
    const user = await this.userService.getOneUser(payload.id);
    if (!user) {
      throw UserNotFoundException('해당 유저를 찾을 수 없습니다.');
    }
  
    const newAccessToken = await this.signToken({ id: user.id, username: user.username }, false);
    const newRefreshToken = await this.signToken({ id: user.id, username: user.username }, true);
  
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
