import { IsEnum, IsNotEmpty } from 'class-validator'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { ApiProperty } from '@nestjs/swagger'

export class GetMenuParamsDto {
  @ApiProperty({
    enum: MenuNode,
    description: 'Nodo del menú a consultar',
    example: MenuNode.MENU_PARAMS,
  })
  @IsNotEmpty({ message: 'El nodo es requerido' })
  @IsEnum(MenuNode, {
    message: `El nodo debe ser uno de: ${Object.values(MenuNode).join(', ')}`
  })
  node: MenuNode
}
