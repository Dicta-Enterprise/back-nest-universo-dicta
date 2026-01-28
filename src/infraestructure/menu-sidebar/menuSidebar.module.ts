import { Module } from '@nestjs/common'
import { MenuSidebarController } from './menuSidebar.controller' 
import { MenuSidebarService } from 'src/core/services/menu-sidebar/menusidebar.service' 


@Module({
  controllers: [MenuSidebarController], 
  providers: [
    MenuSidebarService,

  ],
})
export class MenuSidebarModule {}