import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUpdateClassDTO {
    @IsNotEmpty({ message: 'Class name is required.' })
    @IsString({ message: 'Class name must be a string.' })
    @Length(3, 50, { message: 'Class name must be between 3 and 50 characters.' })
    className: string;
}