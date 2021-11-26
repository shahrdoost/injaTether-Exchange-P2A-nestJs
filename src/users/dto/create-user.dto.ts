import { IsEmail, IsNotEmpty, IsNumberString, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    readonly email: string;


    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;


    @IsNotEmpty()
    @IsNumberString()
    @MinLength(11)
    @MaxLength(11)
    readonly phone: string;
}