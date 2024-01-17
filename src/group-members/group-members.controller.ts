import { Body, Controller, Delete, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddGroupMember } from './dto/add-group-member.dto';
import { GroupMembersService } from './group-members.service';
import { DeleteGroupMember } from './dto/delete-group-member.dto';

@Controller('group-members')
export class GroupMembersController {
  constructor(private groupMembersService: GroupMembersService) {}

  //서비스로 위로 올려보내줄 것
  //멤버 만들기
  // 그럼애도 일단 컨트롤러에 넣고 생각할 것.

  @Post()
  @UsePipes(ValidationPipe)
  async addGroupMember(@Body() addGroupMember:AddGroupMember){
    return await this.groupMembersService.addGroupMember(addGroupMember.groupId, addGroupMember.memberId)
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteGroupMember(@Body() deleteGroupMember: DeleteGroupMember){
    return await this.groupMembersService.deleteGroupMember(deleteGroupMember.groupId, deleteGroupMember.memberId)
  }


}
