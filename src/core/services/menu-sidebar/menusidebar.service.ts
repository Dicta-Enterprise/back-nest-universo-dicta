import { BadRequestException, Injectable } from '@nestjs/common' 
import { PrismaMenuSidebarRepository } from 'src/core/repositories/menu-sidebar/menuSidebar.repository'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { MenuType } from 'src/shared/enums/menu-type.enum'
import { ChildMenuResponseDto, MenuResponseDto } from 'src/application/dto/menu-sidebar/menu-response.dto'
import { MenuSidebar } from '@prisma/client'

@Injectable()
export class MenuSidebarService {
  constructor(
    private readonly menuRepository: PrismaMenuSidebarRepository,
  ) {}

  async getMenusByNode(node: string): Promise<MenuResponseDto[]> {
    this.validateMenuNode(node)

    const allActiveMenus = await this.getAllActiveMenus()

    const fathersInNode = allActiveMenus.filter(menu => 
      menu.typeMenu === 'FATHER' && menu.node === node
    )
    
    if (fathersInNode.length === 0) {
      return []
    }

    return this.buildMenuHierarchy(fathersInNode, allActiveMenus)
  }

  private async getAllActiveMenus(): Promise<MenuSidebar[]> {

    const menuParams = await this.menuRepository.findByNode('MENU_PARAMS')
    const childParams = await this.menuRepository.findByNode('MENU_CHILD_PARAMS')
    
    return [...menuParams, ...childParams] as MenuSidebar[]
  }

  private validateMenuNode(node: string): void {
    if (!Object.values(MenuNode).includes(node as MenuNode)) {
      throw new BadRequestException('INVALID_MENU_NODE')
    }
  }

  private buildMenuHierarchy(
    fathers: MenuSidebar[], 
    allMenus: MenuSidebar[]
  ): MenuResponseDto[] {
    return fathers.map((father): MenuResponseDto => ({
      id: father.id,
      icon: father.icon ?? '',
      name: father.name,
      node: father.node as MenuNode,
      typeMenu: father.typeMenu as MenuType,
      code: father.code,
      route: father.route ?? '',
      children: this.getChildrenForFather(father.id, allMenus), 
    }))
  }

  private getChildrenForFather(
    fatherId: string, 
    allMenus: MenuSidebar[]
  ): ChildMenuResponseDto[] {
    return allMenus
      .filter(menu => {
        if (!menu.parentId) return false
 
        return String(menu.parentId) === String(fatherId)
      })
      .map((child): ChildMenuResponseDto => ({
        id: child.id,
        icon: child.icon ?? '',
        name: child.name,
        node: child.node as MenuNode,
        typeMenu: child.typeMenu as MenuType,
        code: child.code,
        route: child.route ?? '',
        children: [],
      }))
  }
}