import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class accessTokenRequest {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}