import { MenuNode } from 'src/shared/enums/menu-node.enum'

export class MenuRequestedEvent {
  constructor(
    public readonly node: MenuNode,  
    public readonly timestamp: Date = new Date(),
  ) {}
}