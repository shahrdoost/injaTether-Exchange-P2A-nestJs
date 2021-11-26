import { IsEmail, IsNotEmpty, IsNumberString, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateTicketDto {

    @IsNotEmpty()
    readonly title: string;
    @IsNotEmpty()
    readonly message: string;
}
