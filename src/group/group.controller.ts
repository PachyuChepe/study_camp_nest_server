import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  //학습공간과 이어진다.
  //그룹읆 만드는데 두가지가 필요하다 하나는 학승공간 아이디 하나는 그룹멤버 아이디이다 그냥 프론트에서 준다 생각하겠다.
  //컨트롤러엔 넣어도 되는 것
  //그룹을 만든다. O
  //그룹을 삭제한다. O
  //그룹의 이름을 변경한다. (필수는 아닌것 같다 미루자)

  //서비스로 위로 올려 보낼 것.
  //학습공간내 그룹을 찾는다.

  //URL에 갑자기 spaceId가 나오는 것도 그런데 생각좀 더 해보자 일단 놔두고
  @Post('/:spaceId')
  @UsePipes(ValidationPipe)
  async createGroup(@Param('spaceId') spaceId: number, @Body('name') name: string) {
    return await this.groupService.createGroup(spaceId, name);
  }

  @Delete('/:groupId')
  async  deleteGroupById(@Param('groupId') groupId: number) {
    return await this.groupService.deleteGroupById(groupId);
  }

  //미룬 기능
  @Get('/:spaceId')
  async findAllGroupBySpaceId(@Param('spaceId', ParseIntPipe) spaceId: number) {
    return await this.groupService.findAllGroupBySpaceId(spaceId)    
  }
}
