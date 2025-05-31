import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createProfesorDto, updateProfesorDto } from 'src/application/dto/profesor';
import { PROFESOR_REPOSITORY } from 'src/core/constants/constants';
import { Profesor } from 'src/core/entities/profesor/profesor.entity';
import { ProfesorRepository } from 'src/core/repositories/profesor/profesor.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class ProfesorService {

    constructor(
        @Inject(PROFESOR_REPOSITORY)
        private repository: ProfesorRepository,
        private readonly validator: ValidatorService
    ){}

    async crearProfesor(dtoProfesor: createProfesorDto): Promise<Profesor>{
        await this.validator.validate(dtoProfesor, createProfesorDto);

        const existe = await this.repository.findByApellidos(dtoProfesor.apellido_paterno, dtoProfesor.apellido_materno);
        if(existe){
            throw new BussinesRuleException(
                'El profesor ya existe',
                HttpStatus.BAD_REQUEST,
                {
                    apellido_paterno: dtoProfesor.apellido_paterno,
                    apellido_materno: dtoProfesor.apellido_materno,
                    codigoError: 'PROFESOR_DUPLICADO',
                },
            );
        }

        const profesor = new Profesor(
            null,
            dtoProfesor.nombre,
            dtoProfesor.dni,
            dtoProfesor.apellido_paterno,
            dtoProfesor.apellido_materno,
            true,
            dtoProfesor.email,
            dtoProfesor.cursos
        )

        return this.repository.save(profesor);
    }

    async listarProfesores(): Promise<Profesor[]>{
        return this.repository.findAllActive();
    }

    async listarUnProfesor(id: string): Promise<Profesor>{
        const existe = this.repository.findById(id);

        if (!existe) {
            throw new BussinesRuleException(
              'El profesor no existe.',
              HttpStatus.NOT_FOUND,
              {
                id: id,
                codigoError: 'PROFESOR_NO_ENCONTRADO',
              },
            );
          }
      
          return existe;
    }

    async eliminarProfesor(id:string):Promise<Profesor>{
      const profesor = await this.listarUnProfesor(id);

      const estado: boolean = profesor.estado_p === true ? false : true;

      return this.repository.delete(id, estado);

    }

    async actualizarProfesor(id: string, dtoProfesor: updateProfesorDto,): Promise<Profesor>{
      await this.validator.validate(dtoProfesor, updateProfesorDto);

      const profesor = new Profesor(
        null,
        dtoProfesor.nombre,
        dtoProfesor.dni,
        dtoProfesor.apellido_paterno,
        dtoProfesor.apellido_materno,
        true,
        dtoProfesor.email,
        dtoProfesor.cursos
      );

      return this.repository.update(id, profesor);

    }
}
