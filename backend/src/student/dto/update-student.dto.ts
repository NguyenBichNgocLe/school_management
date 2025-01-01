import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

@InputType()
export class UpdateStudentDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Student name must be a string.' })
  @Length(3, 100, {
    message: 'Student name must be between 3 and 100 characters.',
  })
  studentName?: string;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Class ID must be a number.' })
  @Min(1, { message: 'Class ID must be a positive number.' })
  classId?: number;
}
