import { 
  Controller, 
  Get, 
  HttpCode, 
  HttpStatus,
  Param,
  ParseEnumPipe 
} from '@nestjs/common'
import { MenuSidebarService } from '@services/Menu/menu.service'
import { GetMenuDataUseCase } from 'src/application/uses-cases/Menu/get-all-menus.use-case'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Menús')
@Controller('menus')
export class MenuController {
  constructor(
    private readonly menuSidebarService: MenuSidebarService,
    private readonly getMenuDataUseCase: GetMenuDataUseCase,
  ) {}

  @Get(':node')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Obtener menús del sidebar por nodo',
    description: 'Retorna menús organizados jerárquicamente para el sidebar'
  })
  @ApiParam({ 
    name: 'node', 
    enum: MenuNode,
    description: 'Nodo del menú (MENU_PARAMS o MENU_CHILD_PARAMS)',
    example: MenuNode.MENU_PARAMS
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Menús obtenidos exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Nodo inválido'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontraron menús'
  })
  async getMenusByNode(
    @Param('node', new ParseEnumPipe(MenuNode)) node: MenuNode
  ) {
    return this.menuSidebarService.getMenusByNode(node)
  }

}