import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private TaskRepository: TaskRepository
    ) { }

    async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]>{
        return this.TaskRepository.getTasks(filterDTO, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.TaskRepository.findOne({ where: {id, userId: user.id} });

        if (!found) {
            throw new NotFoundException(`Task with ${id} not found.`);
        } else return found;
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task>{
        return this.TaskRepository.createTask(createTaskDTO, user);
    }

    async deleteTask(id: number, user: User): Promise<void>{
        const result = await this.TaskRepository.delete({id, userId: user.id});
        
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ${id} not found.`);
        }
    }

    async updateTaskStatus(
            id: number, 
            status: TaskStatus,
            user: User
            ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;

    }

}
