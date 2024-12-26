import { Injectable } from "@nestjs/common";

export class Student {
    id: number;
    studentName: string;
    className: string;
}

@Injectable()
export class StudentRepository {
    private static NEXT_ID_VALUE = 1;
    private static DATA: Student[] = [];

    private static IncrementIdValue() {
        this.NEXT_ID_VALUE += 1;
    }

    public getById(id: number): Student {
        return StudentRepository.DATA.find((student) => student.id === id);
    }

    public getAll(): Student[] {
        return StudentRepository.DATA;
    }

    public getByClassName(className: string): Student[] {
        return StudentRepository.DATA.filter((student) => student.className.toLowerCase() === className.toLowerCase());
    }

    public getByStudentName(studentName: string): Student | null {
        return StudentRepository.DATA.find(student => student.studentName.toLowerCase() === studentName.toLowerCase());
    }

    public searchStudentsByName(searchString: string): Student[] {
        return StudentRepository.DATA.filter(student => student.studentName.toLowerCase().includes(searchString.toLowerCase()));
    }

    public anyStudentInClass(className: string): boolean {
        return StudentRepository.DATA.some((student) => student.className.toLowerCase() === className.toLowerCase());
    }

    public addStudent(studentName: string, className: string): Student {
        const newStudent = { studentName, className, id: StudentRepository.NEXT_ID_VALUE };
        StudentRepository.DATA.push(newStudent);
        StudentRepository.IncrementIdValue();
        return newStudent;
    }

    public save(student: Student) {
        const index = StudentRepository.DATA.findIndex((s) => s.id === student.id);
        StudentRepository.DATA[index] = student;
        return StudentRepository.DATA[index];
    }

    public deleteStudent(id: number): Student[] {
        const index = StudentRepository.DATA.findIndex((student) => student.id === id);
        const deletedStudent = StudentRepository.DATA.splice(index, 1);
        return deletedStudent;
    }

    public isDuplicatedName(studentName: string): boolean {
        return StudentRepository.DATA.some(student => student.studentName.toLowerCase() === studentName.toLowerCase());
    }
}