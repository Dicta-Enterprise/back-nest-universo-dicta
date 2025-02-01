import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateCursoDto } from "../dto/create-curso.dto";

export class Curso extends OmitType(CreateCursoDto, [] as const) {
    @ApiProperty({ example: '670aa5b834951486809e8fa0' })
    id: string;

    @ApiProperty({ example: new Date() })
    fechaCreacion: Date;

    @ApiProperty({ example: new Date() })
    fechaActualizacion: Date;
}
