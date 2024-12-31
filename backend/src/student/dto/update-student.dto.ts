import { IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateStudentDTO {
    @IsOptional()
    @IsString({ message: 'Student name must be a string.' })
    @Length(3, 100, { message: 'Student name must be between 3 and 100 characters.' })
    studentName?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Class ID must be a number.' })
    @Min(1, { message: 'Class ID must be a positive number.' })
    classId?: number;
}