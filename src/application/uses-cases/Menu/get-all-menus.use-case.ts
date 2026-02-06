import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/services/prisma/prisma.service'
import { MenuNode } from 'src/shared/enums/menu-node.enum'

export interface MenuData {
  message: string
  timestamp: string
  stats: {
    total: number
    active: number
    inactive: number
  }
  byNode: Record<string, number>
  byType: Record<string, number>
  data: unknown[]
}

export interface NodeData {
  node: MenuNode
  count: number
  data: unknown[]
  types: Record<string, number>
}

@Injectable()
export class GetMenuDataUseCase {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async executeGetAll(): Promise<MenuData> {
    const allData = await this.prisma.menuSidebar.findMany({
      orderBy: { order: 'asc' }
    })
    
    return {
      message: 'Datos de depuración',
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

  async executeGetByNode(node: MenuNode): Promise<NodeData> {
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