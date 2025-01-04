import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Class } from './entities/class.entity';
import { ClassService } from './class.service';
import { CreateUpdateClassDTO } from './dto/create-update-class.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { PaginatedClassResponse } from './dto/paginated.class.response';

@Resolver(() => Class)
export class ClassResolver {
  constructor(
    private readonly classService: ClassService,
  ) {}

  // @Roles(['admin', 'principal', 'teacher'])
  // @Query((returns) => [Class])
  // async getAllClass(): Promise<Class[]> {s
  //   return await this.classService.getAllClasses();
  // }
  @Roles(['admin', 'principal', 'teacher'])
  @Query((returns) => PaginatedClassResponse)
  async getAllClass(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 5}) limit: number,
  ): Promise<PaginatedClassResponse> {
    return await this.classService.getAllClasses(page, limit);
  }

  @Roles(['admin', 'principal', 'teacher'])
  @Query((returns) => Class)
  async getClassById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Class> {
    return await this.classService.getClassById(id);
  }

  @Roles(['admin', 'principal'])
  @Mutation((returns) => Class)
  async addClass(
    @Args('createClassDto') createClassDto: CreateUpdateClassDTO,
  ): Promise<Class> {
    return await this.classService.create(createClassDto);
  }

  @Roles(['admin', 'principal'])
  @Mutation((returns) => Class)
  async updateClass(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateClassDto') updateClassDto: CreateUpdateClassDTO,
  ): Promise<Class> {
    return await this.classService.update(id, updateClassDto);
  }

  @Roles(['admin', 'principal'])
  @Mutation((returns) => Class)
  async deleteClass(@Args('id', { type: () => Int }) id: number) {
    return await this.classService.delete(id);
  }
}
