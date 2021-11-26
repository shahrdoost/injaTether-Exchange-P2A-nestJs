import { IsEmail, IsNotEmpty, IsNumberString, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    readonly ticket_id: number;

    @IsNotEmpty()
    readonly message: string;

    readonly image: string;

}
