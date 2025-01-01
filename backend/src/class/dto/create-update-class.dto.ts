import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class CreateUpdateClassDTO {
    @Field()
    @IsNotEmpty({ message: 'Class name is required.' })
    @IsString({ message: 'Class name must be a string.' })
    @Length(3, 50, { message: 'Class name must be between 3 and 50 characters.' })
    className: string;
}