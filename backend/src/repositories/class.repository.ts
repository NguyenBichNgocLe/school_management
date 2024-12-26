import { Injectable } from "@nestjs/common";

export class Class {
    id: number;
    className: string;
}

@Injectable()
export class ClassRepository {
    private static NEXT_ID_VALUE = 1;
    private static DATA: Class[] = [];

    private static IncrementIdValue() {
        this.NEXT_ID_VALUE += 1;
    }

    public getAll(): Class[] {
        return ClassRepository.DATA;
    }

    public getById(id: number): Class | null {
        return ClassRepository.DATA.find((c) => c.id === id);
    }

    public getByClassName(className: string): Class | null {
        return ClassRepository.DATA.find((c) => c.className.toLowerCase() === className.toLowerCase());
    }

    public addClass(className: string): Class {
        const newClass = { className, id: ClassRepository.NEXT_ID_VALUE };
        ClassRepository.DATA.push(newClass);
        ClassRepository.IncrementIdValue();
        return newClass;
    }
    
    public save(savedClass: Class) {
        const index = ClassRepository.DATA.findIndex((c) => c.id === savedClass.id);
        ClassRepository.DATA[index] = savedClass;
        return ClassRepository.DATA[index];
    }

    public deleteClass(id: number): Class[] {
        const classIndex = ClassRepository.DATA.findIndex((c) => c.id === id);
        const deletedClass = ClassRepository.DATA.splice(classIndex, 1);
        return deletedClass;
    }

    public isDuplicatedName(className: string): boolean {
        return ClassRepository.DATA.some(c => c.className.toLowerCase() === className.toLowerCase());
    }

    public isExistedClass(className: string): boolean {
        return ClassRepository.DATA.some(c => c.className.toLowerCase() === className.toLowerCase());
    }
}