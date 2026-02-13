import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateItemColorDto {
  @ApiProperty({
    example: '#FF5733',
    description: 'Color en formato HEX',
  })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'El color debe estar en formato HEX válido',
  })
  color: string;
}
