import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { MenuRepository } from 'src/core/repositories/menu-sidebar/menu-repository.interface'
import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { MenuType } from 'src/shared/enums/menu-type.enum'
import { ChildMenuResponseDto, MenuResponseDto } from 'src/application/dto/menu-sidebar/menu-response.dto'
import { MenuSidebar } from '@prisma/client' 

@Injectable()
export class MenuService {
  constructor(
    @Inject('MENU_REPOSITORY')
    private readonly menuRepository: MenuRepository,
  ) {}

  async getMenusByNode(node: string): Promise<MenuResponseDto[]> {
    this.validateMenuNode(node)
    
    const menus = await this.menuRepository.findByNode(node)
    
    if (!menus.length) {
      throw new NotFoundException('MENUS_NOT_FOUND')
    }

    return this.buildMenuHierarchy(menus)
  }

  private validateMenuNode(node: string): void {
    if (!Object.values(MenuNode).includes(node as MenuNode)) {
      throw new BadRequestException('INVALID_MENU_NODE')
    }
  }

  private buildMenuHierarchy(menus: MenuSidebar[]): MenuResponseDto[] { 
    const fathers = menus.filter(menu => menu.typeMenu === 'FATHER')

    return fathers.map((father): MenuResponseDto => ({
      id: father.id,
      icon: father.icon ?? '',
      name: father.name,
      node: father.node as MenuNode,
      typeMenu: father.typeMenu as MenuType,
      code: father.code,
      route: father.route ?? '',
      children: this.getChildrenForFather(father.id, menus), 
    }))
  }

  private getChildrenForFather(fatherId: string, allMenus: MenuSidebar[]): ChildMenuResponseDto[] { 
    return allMenus
      .filter(menu => menu.parentId === fatherId)
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