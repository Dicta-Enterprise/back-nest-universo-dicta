import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { UpdateIdiomaDto } from 'src/application/dto/idioma/update-idioma.dto';
import { IDIOMA_REPOSITORY } from 'src/core/constants/constants';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class IdiomaService {
  constructor(
    @Inject(IDIOMA_REPOSITORY) private repository: IdiomaRepository,
    private readonly validator: ValidatorService,
  ) {}

  async crearIdioma(dto: any): Promise<Idioma> {

    
    await this.validator.validate(dto, CreateIdiomaDto);
     
    const existe = await this.repository.findByName(dto.nombre);

    if (existe) {
      throw new BussinesRuleException(
        'El idioma ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dto.nombre,
          codigoError: 'IDIOMA_DUPLICADO',
        },
      );
    }
  
    const idioma = new Idioma(null, dto.nombre, true);

    return this.repository.save(idioma);
  }
  
  async listarIdiomas(): Promise<Idioma[]> {
      return this.repository.findAllActive();
  }

   async obtenerUnIdioma(id: string): Promise<Idioma> {
    
      const existe = await this.repository.findById(id);
  
      if (!existe) {
        throw new BussinesRuleException(
          'El idioma no existe',
          HttpStatus.NOT_FOUND,
          {
            id: id,
            codigoError: 'IDIOMA_NO_ENCONTRADA',
          },
        );
      }
  
      return existe;
    }
  

    async actualizarIdioma(
      id: string,
      dto: UpdateIdiomaDto,
    ): Promise<Idioma> {
      await this.validator.validate(dto, UpdateIdiomaDto);
    
      const idioma = new Idioma(
        id,
        dto.nombre,
        true, 
      );
    
      return this.repository.update(id, idioma);
    }
    
  async eliminarIdioma(id: string): Promise<Idioma> {
    console.log("servicio",id)
      const idioma = await this.obtenerUnIdioma(id);
      console.log("idioma",idioma)
      const estado: boolean = idioma.estado === true ? false : true; // Cambia el estado a false si ya está en false
  
      return this.repository.delete(id, estado);
    }
}

