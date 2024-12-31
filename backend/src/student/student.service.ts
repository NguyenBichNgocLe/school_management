import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateStudentDTO } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ILike, Repository } from 'typeorm';
import { Class } from 'src/class/entities/class.entity';
import { CreateStudentDTO } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createStudentDto: CreateStudentDTO) {
    const { studentName, classId } = createStudentDto;

    const existedClass = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!existedClass)
      throw new NotFoundException(`Class with the ID ${classId} not found.`);

    const existedStudent = await this.studentRepository
      .createQueryBuilder('student')
      .where('LOWER(student.studentName) = LOWER(:studentName)', {
        studentName,
      })
      .getOne();
    if (existedStudent) {
      throw new BadRequestException('Student name must be unique.');
    }

    const newStudent = await this.studentRepository.create({
      studentName: studentName,
      cls: { id: classId },
    });

    return await this.studentRepository.save(newStudent);
  }

  async update(id: number, updateStudentDto: UpdateStudentDTO) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found.');

    if (updateStudentDto.classId) {
      const existedClass = await this.classRepository.findOne({
        where: { id: updateStudentDto.classId },
      });
      if (!existedClass) {
        throw new NotFoundException(
          `Class with the ID ${updateStudentDto.classId} not found.`,
        );
      }
      student.cls = existedClass;
    }
    if (updateStudentDto.studentName) {
      const existedStudent = await this.studentRepository
        .createQueryBuilder('student')
        .where('LOWER(student.studentName) = LOWER(:studentName)', {
          studentName: updateStudentDto.studentName,
        })
        .getOne();
      if (existedStudent && existedStudent.id !== id) {
        throw new BadRequestException('Student name must be unique.');
      }
      student.studentName = updateStudentDto.studentName;
    }
    return this.studentRepository.save(student);
  }

  async delete(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found.');

    await this.studentRepository.delete(id);
    return student;
  }

  async getStudentById(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found.');
    return student;
  }

  async getAllStudents() {
    return await this.studentRepository.find();
  }

  async getStudentInSameClass(className: string) {
    const existedClass = await this.classRepository
      .createQueryBuilder('cls')
      .where('LOWER(cls.className) = LOWER(:className)', { className })
      .getOne();
    if (!existedClass)
      throw new NotFoundException(`Class ${className} not found.`);

    return await this.studentRepository.find({
      where: { cls: { id: existedClass.id } },
    });
  }

  async filterStudent(searchString: string) {
    if (!searchString)
      throw new BadRequestException('Need to provide a string to search.');

    return await this.studentRepository.find({
      where: {
        studentName: ILike(`%${searchString}%`),
      },
    });
  }
}
