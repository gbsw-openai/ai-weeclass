import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UsernameConflictException, UserNotFoundException } from 'src/exception/service.exception';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        
      const existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw UsernameConflictException('이미 사용중인 아이디입니다.')
      }
      
        const hashedPassword = await hash(createUserDto.password, 10); 

        const newUser = this.userRepository.create({
            username: createUserDto.username,
            password: hashedPassword,
        });

        return this.userRepository.save(newUser);
    }

    async getOneUser(id: number): Promise<UserEntity> {
      const user = await this.userRepository.findOne({ where: {id} }); 

      if(!user) {
        throw UserNotFoundException('사용자를 찾을 수 없습니다.')
      }

      return user;
    }
}
