import { 
  Controller, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Inject,
  Param,
  ParseEnumPipe 
} from '@nestjs/common'
import { MenuSidebarService } from 'src/core/services/menu-sidebar/menusidebar.service'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaService } from 'src/core/services/prisma/prisma.service' 

@ApiTags('Menús Sidebar')
@Controller('menus')
export class MenuSidebarController {
  constructor(
    private readonly menuSidebarService: MenuSidebarService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
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

  @Get('debug/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '[DEBUG] Ver todos los menús en la base de datos',
    description: 'Endpoint temporal para debugging - muestra todos los registros'
  })
  async debugAll() {
    const allData = await this.prisma.menuSidebar.findMany({
      orderBy: { order: 'asc' }
    })
    
    return {
      message: 'Datos de depuración: ',
      timestamp: new Date().toISOString(),
      stats: {
        total: allData.length,
        active: allData.filter(d => d.active).length,
        inactive: allData.filter(d => !d.active).length,
      },
      byNode: allData.reduce((acc, item) => {
        acc[item.node] = (acc[item.node] || 0) + 1
        return acc
      }, {}),
      byType: allData.reduce((acc, item) => {
        acc[item.typeMenu] = (acc[item.typeMenu] || 0) + 1
        return acc
      }, {}),
      data: allData
    }
  }



  @Get('debug/node/:node')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '[DEBUG] Ver menús por nodo específico',
    description: 'Endpoint temporal - filtra por nodo'
  })
  @ApiParam({ 
    name: 'node', 
    enum: MenuNode,
    description: 'Nodo a filtrar'
  })
  async debugByNode(
    @Param('node', new ParseEnumPipe(MenuNode)) node: MenuNode
  ) {
    const data = await this.prisma.menuSidebar.findMany({
      where: { 
        node,
        active: true 
      },
      orderBy: { order: 'asc' },
    })
    
    return {
      node,
      count: data.length,
      data,
      types: data.reduce((acc, item) => {
        acc[item.typeMenu] = (acc[item.typeMenu] || 0) + 1
        return acc
      }, {})
    }
  }

}

