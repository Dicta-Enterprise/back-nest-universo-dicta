import { Inject, Injectable } from '@nestjs/common';
import { GALAXIA_REPOSITORY } from '@constants/constants';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { Galaxia3DResponseDto  } from 'src/application/dto/galaxia/response-galaxia.dto';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasPorCategoriaResponseDto } from 'src/application/dto/galaxia/galaxia-por-categoria-response.dto';
import { plainToInstance } from 'class-transformer';
import { Result} from 'src/shared/domain/result/result';

@Injectable()
export class GetGalaxiasByCategoriaFor3DUseCase {
  constructor(
    @Inject(GALAXIA_REPOSITORY)
    private readonly galaxiaRepository: GalaxiaRepository,
    private readonly categoriaService: CategoriaService,
  ) {}

  async execute(categoriaId: string): Promise<Result<GalaxiasPorCategoriaResponseDto>> {
    try {
      const categoria = await this.categoriaService.obtenerUnaCategoria(categoriaId);
      if (!categoria) {
        return Result.fail(
          new Error(`Categoría con ID ${categoriaId} no encontrada`)
        );
      }
      const galaxias = await this.galaxiaRepository.findByCategoriaId(categoriaId);

      const galaxiasActivas = galaxias.filter(g => g.estado !== false);

      const galaxiasFormateadas = galaxiasActivas.map((galaxia: Galaxia ) => 
        plainToInstance(Galaxia3DResponseDto, {
          ...galaxia,
          posicion: this.formatPositionFor3D(galaxia.posicion),
          rotacion: this.formatRotationFor3D(galaxia.rotacion),
          estado: galaxia.estado?? true,
          categoriaId: galaxia.categoriaId,
          nombre: galaxia.nombre,
          descripcion: galaxia.descripcion,
          imagen: galaxia.imagen,
          textura: galaxia.textura,
          url: galaxia.url,
        }, {
          excludeExtraneousValues: true,
        })
      );

      const response: GalaxiasPorCategoriaResponseDto = {
        categoria: categoria.nombre?.toLowerCase() || 'general',
        galaxias: galaxiasFormateadas,
        total: galaxiasFormateadas.length,
      };

      return Result.ok(response);
    } catch (error: unknown) {

      const message = error instanceof Error ? error.message : 'Error desconocido';
      return Result.fail(
        new Error(`Error al obtener galaxias: ${message}`)
      );
    }
  }

  private formatPositionFor3D(posicion: unknown): number[] {
    if (Array.isArray(posicion)) {
      return posicion;
    }
    if (posicion && typeof posicion === 'object') {
      const p = posicion as { x?: number; y?: number; z?: number };
      return [
        p.x ?? 0, 
        p.y ?? 0, 
        p.z ?? 0
      ];
    }
    return [0, 0, 0];
  }

  private formatRotationFor3D(rotacion: unknown): number[] {
    if (Array.isArray(rotacion)) {
      return rotacion;
    }
    if (rotacion && typeof rotacion === 'object') {
      const r = rotacion as { x?: number; y?: number; z?: number };
      return [
        r.x ?? 0, 
        r.y ?? 0, 
        r.z ?? 0
      ];
    }
    return [0, 0, 0];
  }
}