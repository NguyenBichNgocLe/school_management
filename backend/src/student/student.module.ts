import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from 'src/repositories/student.repository';
import { ClassRepository } from 'src/repositories/class.repository';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentRepository, ClassRepository]
})
export class StudentModule {}
