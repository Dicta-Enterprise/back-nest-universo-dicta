import { MenuNode } from 'src/shared/enums/menu-node.enum'
import { MenuType } from 'src/shared/enums/menu-type.enum'
import { ApiProperty } from '@nestjs/swagger'

export class MenuResponseDto {
  @ApiProperty({ example: 'aar44tg33sss' })
  id: string
  @ApiProperty({ example: 'pi pi-chart-line' })
  icon: string
  @ApiProperty({ example: 'Menu Principal' })
  name: string
  @ApiProperty({ enum: MenuNode, example: MenuNode.MENU_PARAMS })
  node: MenuNode
  @ApiProperty({ enum: MenuType, example: MenuType.FATHER })
  typeMenu: MenuType
  @ApiProperty({ example: 'FATHER_MENU' })
  code: string
  @ApiProperty({ example: '' })
  route: string
  @ApiProperty({ type: () => [ChildMenuResponseDto] })
  children: ChildMenuResponseDto[]
}

export class ChildMenuResponseDto {
  @ApiProperty({ example: '44fff5sss' })
  id: string
  @ApiProperty({ example: 'pi pi-chart-line' })
  icon: string
  @ApiProperty({ example: 'Dashboard' })
  name: string
  @ApiProperty({ enum: MenuNode, example: MenuNode.MENU_CHILD_PARAMS })
  node: MenuNode
  @ApiProperty({ enum: MenuType, example: MenuType.CHILD })
  typeMenu: MenuType
  @ApiProperty({ example: 'CHILD_DASHBOARD' })
  code: string
  @ApiProperty({ example: '/dashboard' })
  route: string
  @ApiProperty({ example: [] })
  children: [] 
}