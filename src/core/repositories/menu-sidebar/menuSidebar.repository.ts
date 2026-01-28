import { MenuEntity } from 'src/core/entities/menu-sidebar/menuSidebar.entity'

export interface MenuSidebarRepository {
  findByNode(node: string): Promise<MenuEntity[]>
}

export class PrismaMenuSidebarRepository implements MenuSidebarRepository {
  constructor(private prisma: unknown) {}
  
  async findByNode(node: string): Promise<MenuEntity[]> {
    const prismaClient = this.prisma as {
      menuSidebar: {
        findMany: (args: {
          where: { node: string; active: boolean }
          orderBy: { order: 'asc' }
        }) => Promise<unknown[]>
      }
    }
    
    const data = await prismaClient.menuSidebar.findMany({
      where: { node, active: true },
      orderBy: { order: 'asc' },
    })
    
    return MenuEntity.fromPrismaList(data)
  }
}