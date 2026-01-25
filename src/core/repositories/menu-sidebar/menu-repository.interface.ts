import {MenuSidebar} from '@prisma/client'

export interface MenuRepository {
  findByNode(node: string): Promise<MenuSidebar[]>
}

