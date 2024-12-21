import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('student')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
    ) {}

    @Post('/')
    @Roles(['admin', 'teacher'])
    addStudent(@Body() createStudentDto: CreateStudentDTO) {
        return this.studentService.create(createStudentDto.studentName, createStudentDto.className);
    }

    @Patch('/:id')
    @Roles(['admin', 'teacher'])
    updateStudent(
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDTO,
    ) {
        return this.studentService.update(+id, updateStudentDto);
    }

    @Delete('/:id')
    @Roles(['admin', 'teacher'])
    deleteStudent(@Param('id') id: string) {
        return this.studentService.delete(+id);
    }

    @Get('/usingID/:id')
    @Roles(['admin', 'teacher', 'principal'])
    getStudentById(@Param('id') id: string) {
        return this.studentService.getStudentById(+id);
    }

    @Get('/usingName')
    @Roles(['admin', 'teacher', 'principal'])
    filterStudents(@Query('searchString') searchString: string) {
        return this.studentService.filterStudent(searchString);
    }

    @Get('/all')
    @Roles(['admin', 'principal', 'teacher'])
    getAllStudents() {
        return this.studentService.getAllStudents();
    }

    @Get('/inOneClass')
    @Roles(['admin', 'teacher', 'principal'])
    getStudentInSameClass(@Query('className') className: string) {
        return this.studentService.getStudentInSameClass(className);
    }
}
