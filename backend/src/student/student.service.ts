import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassRepository } from 'src/repositories/class.repository';
import { StudentRepository } from 'src/repositories/student.repository';
import { UpdateStudentDTO } from './dto/update-student.dto';

@Injectable()
export class StudentService {
    constructor(
        private studentRepo: StudentRepository,
        private classRepo: ClassRepository,
    ) { }

    create(studentName: string, className: string) {
        if (!this.classRepo.isExistedClass(className))
            throw new NotFoundException(`Class ${className} not found.`);
        if (this.studentRepo.isDuplicatedName(studentName))
            throw new BadRequestException('Student name must be unique.');

        const newStudent = this.studentRepo.addStudent(studentName, className);
        return newStudent;
    }

    update(id: number, updateStudentDto: UpdateStudentDTO) {
        let student = this.studentRepo.getById(id);
        if (!student)
            throw new NotFoundException('Student not found.');
        if (updateStudentDto.className && !this.classRepo.isExistedClass(updateStudentDto.className))
            throw new NotFoundException(`Class ${updateStudentDto.className} not found.`);
        if (updateStudentDto.studentName && this.studentRepo.isDuplicatedName(updateStudentDto.studentName))
            throw new BadRequestException('Student name must be unique.');

        return this.studentRepo.save({ ...student, ...updateStudentDto });
    }

    delete(id: number) {
        const student = this.studentRepo.getById(id);
        if (!student)
            throw new NotFoundException('Student not found.');
        return this.studentRepo.deleteStudent(id);
    }

    getStudentById(id: number) {
        const foundStudent = this.studentRepo.getById(id);
        if (!foundStudent)
            throw new NotFoundException('Student not found.');
        return foundStudent;
    }

    getAllStudents() {
        return this.studentRepo.getAll();
    }

    getStudentInSameClass(className: string) {
        if (!this.classRepo.isExistedClass(className))
            throw new NotFoundException('Class not found.');
        return this.studentRepo.getByClassName(className);
    }

    filterStudent(searchString: string) {
        if (!searchString)
            throw new BadRequestException('Need to provide a string to search.');
        return this.studentRepo.searchStudentsByName(searchString);
    }
}
