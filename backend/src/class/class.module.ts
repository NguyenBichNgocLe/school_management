import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { ClassRepository } from 'src/repositories/class.repository';
import { StudentRepository } from 'src/repositories/student.repository';

@Module({
  providers: [ClassService, ClassRepository, StudentRepository],
  controllers: [ClassController]
})
export class ClassModule {}
