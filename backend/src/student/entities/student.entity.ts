import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Class } from 'src/class/entities/class.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('student')
@ObjectType()
export class Student {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  studentName: string;

  @ManyToOne(() => Class, (cls) => cls.students, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => Class, { nullable: false })
  cls: Class;
}
