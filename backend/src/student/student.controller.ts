import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/')
  @Roles(['admin', 'teacher'])
  async addStudent(@Body() createStudentDto: CreateStudentDTO) {
    return this.studentService.create(createStudentDto);
  }

  @Patch('/:id')
  @Roles(['admin', 'teacher'])
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDTO,
  ) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete('/:id')
  @Roles(['admin', 'teacher'])
  async deleteStudent(@Param('id') id: string) {
    return this.studentService.delete(+id);
  }

  @Get('/usingID/:id')
  @Roles(['admin', 'teacher', 'principal'])
  async getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(+id);
  }

  @Get('/usingName')
  @Roles(['admin', 'teacher', 'principal'])
  async filterStudents(@Query('searchString') searchString: string) {
    return this.studentService.filterStudent(searchString);
  }

  @Get('/all')
  @Roles(['admin', 'principal', 'teacher'])
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  @Get('/inOneClass')
  @Roles(['admin', 'teacher', 'principal'])
  async getStudentInSameClass(@Query('className') className: string) {
    return this.studentService.getStudentInSameClass(className);
  }
}
