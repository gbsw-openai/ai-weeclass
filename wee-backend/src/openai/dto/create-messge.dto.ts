import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty( {message: '대화를 입력해주세요'})
  userMessage: string;
}