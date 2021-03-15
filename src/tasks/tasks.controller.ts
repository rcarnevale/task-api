import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidatorPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController');

    constructor(
        private taskssService: TasksService
    ) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filter: GetTaskFilterDTO,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filter)}`);
        return this.taskssService.getTasks(filter, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskssService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDTO)}`);
        return this.taskssService.createTask(createTaskDTO, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskssService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    patchStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidatorPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskssService.updateTaskStatus(id, status, user);
    }

}
