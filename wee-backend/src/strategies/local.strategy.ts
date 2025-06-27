import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const createUserDto:  CreateUserDto = { username, password };
    const user = await this.authService.validateUser(createUserDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}