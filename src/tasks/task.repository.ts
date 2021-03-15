import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TaskRepository');

    async getTasks(filter: GetTaskFilterDTO, user: User): Promise<Task[]> {
        const { search, status } = filter;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id })

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        try {
            const tasks = query.getMany();
            return tasks;

        } catch (err) {
            this.logger.error(`Failed to get task for user ${user.username}. Filters: ${filter}`, err.stack);
            throw new InternalServerErrorException();
        }

    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = createTaskDTO;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (err) {
            this.logger.error(`Failed to create task for user ${user.username}. Data: ${createTaskDTO}`, err.stack);
            throw new InternalServerErrorException();
        }

        delete task.user;
        return task;
    }

}