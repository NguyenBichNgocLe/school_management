import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateUpdateClassDTO } from './dto/create-update-class.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('class')
export class ClassController {
    constructor(
        private readonly classService: ClassService,
    ) { }

    @Post('/')
    @Roles(['admin', 'principal'])
    addClass(@Body() createClassDto: CreateUpdateClassDTO) {
        return this.classService.create(createClassDto.className);
    }

    @Get('/usingID/:id')
    @Roles(['admin', 'principal', 'teacher'])
    getClassById(@Param('id') id: string) {
        return this.classService.getClassById(+id);
    }

    @Get('/all')
    @Roles(['admin', 'principal', 'teacher'])
    getAllClasses() {
        return this.classService.getAllClasses();
    }

    @Patch('/:id')
    @Roles(['admin', 'principal'])
    updateClass(
        @Param('id') id: string,
        @Body() updateClassDto: CreateUpdateClassDTO
    ) {
        return this.classService.update(+id, updateClassDto.className);
    }

    @Delete('/:id')
    @Roles(['admin', 'principal'])
    deleteClass(@Param('id') id: string) {
        return this.classService.delete(+id);
    }
}