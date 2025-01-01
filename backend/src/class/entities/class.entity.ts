import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('class')
@ObjectType()
export class Class {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  className: string;

  @OneToMany(() => Student, (student) => student.cls)
  @Field((type) => [Student], { nullable: true })
  students?: Student[];
}
