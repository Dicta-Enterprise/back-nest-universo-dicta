import { Injectable } from "@nestjs/common";
import { ProfesorService } from '../../../core/services/profesor/profesor.service';
import { Result } from "src/shared/domain/result/result";
import { Profesor } from "src/core/entities/profesor/profesor.entity";

@Injectable()
export class GetAllProfesorUseCase{
    constructor(
        private readonly profesorService: ProfesorService,
    ){}

    async execute(): Promise<Result<Profesor[]>>{

        try {
            const profesores = await this.profesorService.listarProfesores();
            return Result.okList(profesores);

        } catch(error){
            return Result.fail(error);
        }
    }
}