import { Controller, Get, HttpCode, HttpStatus, Param, UsePipes, ValidationPipe } from '@nestjs/common'
import { MenuSidebarService } from '@services/menu-sidebar/menusidebar.service'
import { GetMenuParamsDto } from 'src/application/dto/menu-sidebar/get-menu-sidebar-params.dto'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('menus') 
@Controller('menus')
export class MenuSidebarController {
  constructor(private readonly menuService: MenuSidebarService) {}

  @Get(':node')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Obtener menús jerárquicos por nodo' })
  @ApiParam({ 
    name: 'node', 
    enum: ['MENU_PARAMS', 'MENU_CHILD_PARAMS'],
    description: 'Nodo del menú a consultar'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de menús organizados jerárquicamente' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Nodo inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontraron menús' 
  })
  async getMenusByNode(@Param() params: GetMenuParamsDto) {
    return this.menuService.getMenusByNode(params.node)
  }
}