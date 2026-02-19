import { Injectable } from '@nestjs/common';
import { CreateMultipleGalaxiasDto, GalaxiaDataDto } from 'src/application/dto/galaxia/create-multiple-galaxia.dto';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateMultipleGalaxiasUseCase {
  constructor(private readonly galaxiaService: GalaxiasService) {}

  async execute(dto: CreateMultipleGalaxiasDto): Promise<Result<Galaxia[]>> {
    try {
      const grupos = ['Niños', 'Jóvenes', 'Adultos'];
      const listaFinalGalaxias: GalaxiaDataDto[] = [];

      // Por cada galaxia enviada en el array 'galaxias' del DTO...
      for (const galaxiaOriginal of dto.galaxias) {
        
        // Creamos 3 copias totalmente independientes
        for (const grupo of grupos) {
          const nuevaGalaxia: GalaxiaDataDto = {
            ...galaxiaOriginal, // Copiamos todas las propiedades (posicion, rotacion, url, etc.)
            nombre: `${galaxiaOriginal.nombre || dto.nombre} - ${grupo}`, // Diferenciador único de nombre
            tema: undefined // Forzamos que el service genere un tema único basado en el nuevo nombre
          };
          
          listaFinalGalaxias.push(nuevaGalaxia);
        }
      }

      // Reemplazamos el array original por el expandido (3 por cada una)
      const dtoParaService = {
        ...dto,
        galaxias: listaFinalGalaxias
      };

      // El service recibirá 3 objetos y llamará a repository.saveMultiple()
      const galaxiasCreadas = await this.galaxiaService.crearMultiplesGalaxias(dtoParaService);
      
      return Result.ok(galaxiasCreadas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}