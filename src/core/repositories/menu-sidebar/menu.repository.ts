import { MenuEntity } from 'src/core/entities/menu-sidebar/Menu.entity'

export interface MenuRepository {
  findByNode(node: string): Promise<MenuEntity[]>
}

export class PrismaMenuRepository implements MenuRepository {
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