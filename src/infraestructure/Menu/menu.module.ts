import { Module } from '@nestjs/common'
import { MenuController } from './menu.controller'
import { MenuSidebarService } from '@services/Menu/menu.service'
import { GetMenuByNodeUseCase } from 'src/application/uses-cases/Menu/get-menu-by-node.use-case'
import { GetMenuDataUseCase } from 'src/application/uses-cases/Menu/get-all-menus.use-case'
import { PrismaMenuSidebarRepository } from '@repositories/Menus/menu.repository'
import { PrismaService } from 'src/core/services/prisma/prisma.service'

@Module({
  controllers: [MenuController],
  providers: [
    MenuSidebarService,
    GetMenuByNodeUseCase,
    GetMenuDataUseCase,
    PrismaMenuSidebarRepository,
    PrismaService,
  

  {
      provide: 'MENU_SIDEBAR_REPOSITORY', 
      useClass: PrismaMenuSidebarRepository, 
    },
  ],
  exports: [GetMenuDataUseCase,MenuSidebarService,PrismaService,],
})
export class MenuModule {}