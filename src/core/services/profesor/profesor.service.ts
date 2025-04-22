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

        const existe = await this.repository.findByNameAndApellido(dtoProfesor.nombre, dtoProfesor.apellido);
        if(existe){
            throw new BussinesRuleException(
                'El profesor ya existe',
                HttpStatus.BAD_REQUEST,
                {
                    nombre: dtoProfesor.nombre,
                    apellido: dtoProfesor.apellido,
                    codigoError: 'PROFESOR_DUPLICADO',
                },
            );
        }

        const profesor = new Profesor(
            null,
            dtoProfesor.nombre,
            dtoProfesor.apellido,
            dtoProfesor.email
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

    async eliminarProfesor(id:string):Promise<void>{

        const existe = await this.repository.findById(id);

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

        await this.repository.delete(id);

    }

    async actualizarProfesor(id: string, dtoProfesor: updateProfesorDto,): Promise<Profesor>{
      await this.validator.validate(dtoProfesor, updateProfesorDto);

      const profesor = new Profesor(
        null,
        dtoProfesor.nombre,
        dtoProfesor.apellido,
        dtoProfesor.email,
      );

      return this.repository.update(id, profesor);

    }
}
