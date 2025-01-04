import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Class } from "../entities/class.entity";

@ObjectType()
export class PaginatedClassResponse {
  @Field(() => [Class])
  data: Class[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}