import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { ProfesorController } from './profesor.controller';
import { PROFESOR_REPOSITORY } from 'src/core/constants/constants';
import { ProfesorPrismaRepository } from 'src/infraestructure/persistence/profesor/profesor.prisma.repository';
import { ProfesorService } from 'src/core/services/profesor/profesor.service';
import { CreateProfesorUseCase } from 'src/application/uses-cases/profesor/create-profesor.use-case';
import { DeleteProfesorUseCase, GetAllProfesorUseCase, GetOneProfesorUseCase, UpdateProfesorUseCase } from 'src/application/uses-cases/profesor';

@Module({
    imports:[SharedModule, PrismaModule],
    controllers: [ProfesorController],
    providers:[{
        provide: PROFESOR_REPOSITORY,
        useClass: ProfesorPrismaRepository,
    },
    ProfesorService,
    CreateProfesorUseCase,
    GetAllProfesorUseCase,
    GetOneProfesorUseCase,
    DeleteProfesorUseCase,
    UpdateProfesorUseCase,
    ],
    exports:[ProfesorService, PROFESOR_REPOSITORY],

})
export class ProfesorModule {}
