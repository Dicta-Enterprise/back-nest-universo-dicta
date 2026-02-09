import { Injectable } from '@nestjs/common'
import { GetMenuByNodeUseCase } from 'src/application/uses-cases/Menu/get-menu-by-node.use-case'

@Injectable()
export class MenuSidebarService {
  constructor(
    private readonly getMenuByNodeUseCase: GetMenuByNodeUseCase,
  ) {}

  async getMenusByNode(node: string) {
    return this.getMenuByNodeUseCase.execute(node)
  }
}
