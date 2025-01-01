import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

@InputType()
export class CreateStudentDTO {
  @Field()
  @IsNotEmpty({ message: 'Student name is required.' })
  @IsString({ message: 'Student name must be a string.' })
  @Length(3, 100, {
    message: 'Student name must be between 3 and 100 characters.',
  })
  studentName: string;

  @Field((type) => Int)
  @IsNotEmpty({ message: 'Class ID is required.' })
  @IsNumber({}, { message: 'Class ID must be a number.' })
  @Min(1, { message: 'Class ID must be a positive number.' })
  classId: number;
}
