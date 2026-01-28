import { MenuSidebarRepository } from 'src/core/repositories/menu-sidebar/menuSidebar.repository'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { MenuType } from 'src/shared/enums/menu-type.enum'
import { MenuResponse } from 'src/core/entities/menu-sidebar/menuSidebar.entity' 


class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BadRequestError'
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class GetMenusByNodeUseCase {
  constructor(private readonly menuRepo: MenuSidebarRepository) {}

  async execute(node: string): Promise<MenuResponse[]> {
    if (!this.isValidMenuNodeString(node)) {
      throw new BadRequestError('INVALID_MENU_NODE')
    }

    const menus = await this.menuRepo.findByNode(node)
    if (!menus.length) {
      throw new NotFoundError('MENUS_NOT_FOUND')
    }  

    const fathers = menus.filter(menu => menu.typeMenu === 'FATHER')
    return fathers.map(father => ({
      id: father.id,
      icon: father.icon ?? '',
      name: father.name,
      node: father.node as MenuNode,
      typeMenu: father.typeMenu as MenuType,
      code: father.code,
      route: father.route ?? '',
      children: menus
        .filter(child => child.parentId === father.id)
        .map(child => ({
          id: child.id,
          icon: child.icon ?? '',
          name: child.name,
          node: child.node as MenuNode,
          typeMenu: child.typeMenu as MenuType,
          code: child.code,
          route: child.route ?? '',
          children: [],
        })),
    }))
  }

  private isValidMenuNodeString(node: string): boolean {
    return node === MenuNode.MENU_PARAMS || node === MenuNode.MENU_CHILD_PARAMS
  }
}