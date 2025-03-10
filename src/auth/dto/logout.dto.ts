import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}
