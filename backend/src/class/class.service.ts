import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassRepository } from 'src/repositories/class.repository';
import { StudentRepository } from 'src/repositories/student.repository';

@Injectable()
export class ClassService {
    constructor(
        private classRepo: ClassRepository,
        private studentRepo: StudentRepository
    ) { }

    create(className: string) {
        if (this.classRepo.isDuplicatedName(className))
            throw new BadRequestException('Class name must be unique.');

        const newClass = this.classRepo.addClass(className);
        return newClass;
    }

    getClassById(id: number) {
        const foundClass = this.classRepo.getById(id);
        if (!foundClass)
            throw new NotFoundException(`Class with ID ${id} not found.`);
        return foundClass;
    }

    getAllClasses() {
        return this.classRepo.getAll();
    }

    update(id: number, className: string) {
        const foundClass = this.classRepo.getById(id);
        if (!foundClass)
            throw new NotFoundException(`Class with ID ${id} not found.`);
        if (this.classRepo.isDuplicatedName(className))
            throw new BadRequestException('Class name must be unique.');

        this.studentRepo
            .getByClassName(foundClass.className)
            .forEach(student => this.studentRepo.save({ ...student, className }));

        return this.classRepo.save({ ...foundClass, className });
    }

    delete(id: number) {
        const foundClass = this.classRepo.getById(id);
        if (!foundClass)
            throw new NotFoundException(`Class with ID ${id} not found.`);

        if(this.studentRepo.anyStudentInClass(foundClass.className))
            throw new BadRequestException('Cannot delete a class with students.');

        return this.classRepo.deleteClass(id);
    }
}
