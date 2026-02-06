import { Injectable } from '@nestjs/common'
import { MenuEntity } from 'src/core/entities/menu-sidebar/menuSidebar.entity'
import { PrismaService } from 'src/core/services/prisma/prisma.service'
import { MenuSidebar } from '@prisma/client'
import { MenuSidebarRepository } from 'src/core/repositories/Menus/menu-repository.interface'
@Injectable()
export class PrismaMenuSidebarRepository implements MenuSidebarRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  
  async findByNode(node: string): Promise<MenuEntity[]> {
    const data = await this.prisma.menuSidebar.findMany({
      where: { 
        node, 
        active: true 
      },
      orderBy: { 
        order: 'asc' 
      },
    })
    
    return MenuEntity.fromPrismaList(data)
  }
  async findAllActive(): Promise<MenuSidebar[]> {
    return this.prisma.menuSidebar.findMany({
      where: { 
        active: true 
      },
      orderBy: { 
        order: 'asc' 
      },
    })
  }
}