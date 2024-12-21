import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateStudentDTO {
    @IsNotEmpty({ message: 'Student name is required.' })
    @IsString({ message: 'Student name must be a string.' })
    @Length(3, 100, { message: 'Student name must be between 3 and 100 characters.'})
    studentName: string;

    @IsNotEmpty({ message: 'Class name is required.' })
    @IsString({ message: 'Class name must be a string.' })
    @Length(3, 50, { message: 'Class name must be between 3 and 50 characters.' })
    className: string;
}