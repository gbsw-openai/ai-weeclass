import { IsString } from "class-validator";  
export class CreateAccessTokenByRefreshToken {
    
    @IsString()
    refreshToken: string; 
}
