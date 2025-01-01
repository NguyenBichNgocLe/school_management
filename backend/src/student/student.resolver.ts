import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Roles(['admin', 'principal', 'teacher'])
  @Query((returns) => [Student])
  async getAllStudents(): Promise<Student[]> {
    return await this.studentService.getAllStudents();
  }

  @Roles(['admin', 'teacher', 'principal'])
  @Query((returns) => Student)
  async getStudentById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Student> {
    return await this.studentService.getStudentById(id);
  }

  @Roles(['admin', 'teacher', 'principal'])
  @Query((returns) => [Student])
  async filterStudents(
    @Args('searchString') searchString: string,
  ): Promise<Student[]> {
    return await this.studentService.filterStudent(searchString);
  }

  @Roles(['admin', 'teacher', 'principal'])
  @Query((returns) => [Student])
  async getStudentInSameClass(
    @Args('className') className: string,
  ): Promise<Student[]> {
    return await this.studentService.getStudentInSameClass(className);
  }

  @Roles(['admin', 'teacher'])
  @Mutation((returns) => Student)
  async addStudent(
    @Args('createStudentDto') createStudentDto: CreateStudentDTO,
  ): Promise<Student> {
    return await this.studentService.create(createStudentDto);
  }

  @Roles(['admin', 'teacher'])
  @Mutation((returns) => Student)
  async updateStudent(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStudentDto') updateStudentDto: UpdateStudentDTO,
  ): Promise<Student> {
    return await this.studentService.update(id, updateStudentDto);
  }

  @Roles(['admin', 'teacher'])
  @Mutation((returns) => Student)
  async deleteStudent(@Args('id', { type: () => Int }) id: number) {
    return await this.studentService.delete(id);
  }
}
