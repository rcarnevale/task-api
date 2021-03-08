import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";


export class TaskStatusValidatorPipe implements PipeTransform{

    readonly AllowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];
    
    transform(value: string, metadata: ArgumentMetadata){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)) throw new BadRequestException(`${value} is an invalid status.`);
        return value;
    }

    private isStatusValid(status){
        const index = this.AllowedStatus.indexOf(status);
        return index !== -1
    }
}