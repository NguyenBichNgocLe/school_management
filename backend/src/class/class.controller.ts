import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateUpdateClassDTO } from './dto/create-update-class.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/')
  @Roles(['admin', 'principal'])
  async addClass(@Body() createClassDto: CreateUpdateClassDTO) {
    return this.classService.create(createClassDto);
  }

  @Get('/usingID/:id')
  @Roles(['admin', 'principal', 'teacher'])
  async getClassById(@Param('id') id: string) {
    return this.classService.getClassById(+id);
  }

  @Get('/all')
  @Roles(['admin', 'principal', 'teacher'])
  async getAllClasses() {
    return this.classService.getAllClasses();
  }

  @Patch('/:id')
  @Roles(['admin', 'principal'])
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: CreateUpdateClassDTO,
  ) {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete('/:id')
  @Roles(['admin', 'principal'])
  async deleteClass(@Param('id') id: string) {
    return this.classService.delete(+id);
  }
}
