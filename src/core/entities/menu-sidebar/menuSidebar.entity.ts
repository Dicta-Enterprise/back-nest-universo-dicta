import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { MenuType } from 'src/shared/enums/menu-type.enum'

interface PrismaMenuData {
  id: string
  name: string
  icon: string 
  route: string 
  code: string
  node: string
  typeMenu: string
  parentId: string | null
  order: number
  active: boolean
}

export class MenuEntity {
  constructor(
    public id: string,
    public name: string,
    public icon: string ,
    public route: string ,
    public code: string,
    public node: string,
    public typeMenu: string,
    public parentId: string | null,
    public order: number,
    public active: boolean,
  ) {}

  static fromPrisma(data: unknown): MenuEntity {
    const validatedData = this.validatePrismaData(data)
    
    return new MenuEntity(
      validatedData.id,
      validatedData.name,
      validatedData.icon,
      validatedData.route,
      validatedData.code,
      validatedData.node,
      validatedData.typeMenu,
      validatedData.parentId,
      validatedData.order,
      validatedData.active,
    )
  }

  static fromPrismaList(data: unknown[]): MenuEntity[] {
    return data.map(item => MenuEntity.fromPrisma(item))
  }

  private static validatePrismaData(data: unknown): PrismaMenuData {

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid Prisma data: expected object')
    }

    const obj = data as Record<string, unknown>

    const requiredFields = ['id', 'name', 'code', 'node', 'typeMenu', 'order', 'active']
    for (const field of requiredFields) {
      if (!(field in obj)) {
        throw new Error(`Invalid Prisma data: missing field ${field}`)
      }
    }

    return {
      id: String(obj.id),
      name: String(obj.name),
      icon: obj.icon === null ? null : String(obj.icon),
      route: obj.route === null ? null : String(obj.route),
      code: String(obj.code),
      node: String(obj.node),
      typeMenu: String(obj.typeMenu),
      parentId: obj.parentId === null ? null : String(obj.parentId),
      order: Number(obj.order),
      active: Boolean(obj.active),
    }
  }

  isFather(): boolean {
    return this.typeMenu === 'FATHER'
  }

  isChild(): boolean {
    return this.typeMenu === 'CHILD'
  }

  hasChildren(): boolean {
    return this.isFather()
  }

  toResponse(): MenuResponse {
    return {
      id: this.id,
      icon: this.icon ?? '',
      name: this.name,
      node: this.node as MenuNode,
      typeMenu: this.typeMenu as MenuType,
      code: this.code,
      route: this.route ?? '',
      children: [], 
    }
  }
}

export interface MenuResponse {
  id: string
  icon: string
  name: string
  node: MenuNode
  typeMenu: MenuType
  code: string
  route: string
  children: MenuResponse[]
}

export interface ChildMenuResponse extends Omit<MenuResponse, 'children'> {
  children: []  
}