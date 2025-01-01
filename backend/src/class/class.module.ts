import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { ClassResolver } from './class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Student])],
  providers: [ClassService, ClassResolver],
})
export class ClassModule {}
