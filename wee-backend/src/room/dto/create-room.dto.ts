import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty( {message: '방이름을 입력해주세요.'})
  name: string
}
