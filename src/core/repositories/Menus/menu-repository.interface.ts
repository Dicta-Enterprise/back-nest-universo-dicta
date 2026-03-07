import { MenuEntity } from 'src/core/entities/menu-sidebar/menuSidebar.entity'
import {MenuSidebar} from '@prisma/client'

export interface MenuSidebarRepository {
  findByNode(node: string): Promise<MenuEntity[]>
  findAllActive(): Promise<MenuSidebar[]> 
}
