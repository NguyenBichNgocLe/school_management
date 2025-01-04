import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { CreateUpdateClassDTO } from './dto/create-update-class.dto';
import { Student } from 'src/student/entities/student.entity';
import { PaginatedClassResponse } from './dto/paginated.class.response';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createClassDto: CreateUpdateClassDTO) {
    const existedName = await this.classRepository
      .createQueryBuilder('cls')
      .where('LOWER(cls.className) = LOWER(:className)', {
        className: createClassDto.className,
      })
      .getOne();
    if (existedName)
      throw new BadRequestException('Class name must be unique.');

    const newClass = await this.classRepository.create(createClassDto);
    return await this.classRepository.save(newClass);
  }

  async getClassById(id: number) {
    const foundClass = await this.classRepository.findOne({ where: { id } });
    if (!foundClass)
      throw new NotFoundException(`Class with ID ${id} not found.`);
    return foundClass;
  }

  // async getAllClasses() {
  //   return await this.classRepository.find();
  // }
  async getAllClasses(page: number, limit: number): Promise<PaginatedClassResponse> {
    if(page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers.');
    }

    const [ classes, total ] = await this.classRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data: classes,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, updateClassDto: CreateUpdateClassDTO) {
    const foundClass = await this.classRepository.findOne({ where: { id } });
    if (!foundClass)
      throw new NotFoundException(`Class with ID ${id} not found.`);

    const existedName = await this.classRepository
      .createQueryBuilder('cls')
      .where('LOWER(cls.className) = LOWER(:className)', {
        className: updateClassDto.className,
      })
      .getOne();
    if (existedName && existedName.id !== id)
      throw new BadRequestException('Class name must be unique.');

    return this.classRepository.save({ id, ...updateClassDto });
  }

  async delete(id: number) {
    const foundClass = await this.classRepository.findOne({ where: { id } });
    if (!foundClass)
      throw new NotFoundException(`Class with ID ${id} not found.`);

    const studentInClass = await this.studentRepository.findOne({
      where: { cls: { id } },
    });
    if (studentInClass)
      throw new BadRequestException('Cannot delete a class with students.');

    await this.classRepository.delete(id);
    return foundClass;
  }
}
