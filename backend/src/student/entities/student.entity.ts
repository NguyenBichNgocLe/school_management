import { Class } from 'src/class/entities/class.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  studentName: string;

  @ManyToOne(() => Class, (cls) => cls.students, { onDelete: 'CASCADE', eager: true })
  cls: Class;
}
