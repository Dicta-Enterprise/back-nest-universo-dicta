import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaEvent } from 'src/domain/events/galaxia/galaxia-creado.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia';
import { Result } from 'src/shared/domain/result/result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActualizarGalaxiaCasoDeUso {
    constructor(
        private readonly galaxiasService: GalaxiasService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async execute(id: string, dto: UpdateGalaxiaDto): Promise<Result<Galaxia>> {
        try {
            // Obtener los datos crudos de la galaxia
            const resultData = await this.galaxiasService.ActualizarGalaxia(id, dto);

            // Convertir los datos crudos en una instancia de Galaxia
            const galaxia = Galaxia.fromPrisma(resultData.data);

            // Verificar que galaxia es una instancia de la clase Galaxia
            if (galaxia instanceof Galaxia) {
                // Emitir el evento de galaxia actualizada
                this.eventEmitter.emit('galaxia.actualizada', new GalaxiaEvent(galaxia));
                return Result.ok(galaxia);
            } else {
                throw new Error('No se pudo crear una instancia válida de Galaxia.');
            }
        } catch (error) {
            return Result.fail(error);
        }
    }
}
