import { Module } from '@nestjs/common'
import { MenuSidebarController } from './menuSidebar.controller'
import { MenuSidebarService } from 'src/core/services/menu-sidebar/menusidebar.service'
import { PrismaMenuSidebarRepository } from 'src/core/repositories/menu-sidebar/menuSidebar.repository'
import { PrismaService } from 'src/core/services/prisma/prisma.service'

@Module({
  controllers: [MenuSidebarController],
  providers: [
    MenuSidebarService,
    PrismaService,
    {
      provide: 'MENU_REPOSITORY', 
      useClass: PrismaMenuSidebarRepository, 
    },
  
    {
      provide: PrismaMenuSidebarRepository, 
      useClass: PrismaMenuSidebarRepository,
    },
  ],
  exports: [MenuSidebarService],
})
export class MenuSidebarModule {}