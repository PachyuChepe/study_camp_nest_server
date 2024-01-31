import {
  Controller,
  Get,
  Post,
  Body,
  // Patch, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Req,
  Patch,
} from '@nestjs/common';
import { SpaceMembersService } from './space-members.service';
// import { CreateSpaceMemberDto } from './dto/create-space-member.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
// import { UpdateSpaceMemberDto } from './dto/update-space-member.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { AddMemberInSpaceDto } from './dto/add-member-in-space.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DeleteMemberInSpaceDto } from './dto/delete-member-in-space.dto';
import { GetMemberInSpaceDto } from './dto/get-member-in-space.dto';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto ';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('space-members')
export class SpaceMembersController {
  constructor(private readonly spaceMembersService: SpaceMembersService) {}

  @Post('info')
  @UsePipes(ValidationPipe)
  async getMemberInSpace(
    @Body() getMemberInSpaceDto: GetMemberInSpaceDto,
    @Req() req,
  ) {
    return await this.spaceMembersService.getMemberInSpace(
      getMemberInSpaceDto,
      req.user.id,
    );
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addMemberInSpace(@Body() addMemberInSpaceDto: AddMemberInSpaceDto) {
    return await this.spaceMembersService.addMemberInSpace(addMemberInSpaceDto);
  }

  // @Delete()
  // @UsePipes(ValidationPipe)
  // async deleteMemberInSpace(@Body() deleteMemberInSpaceDto: DeleteMemberInSpaceDto) {
  //   return await this.spaceMembersService.deleteMemberInSpace(deleteMemberInSpaceDto);
  // }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteMemberInSpace(
    @Body() deleteMemberInSpaceDto: DeleteMemberInSpaceDto,
    @Request() req,
  ) {
    // creatorId를 직접 서비스 메소드에 전달
    return await this.spaceMembersService.deleteMemberInSpace(
      deleteMemberInSpaceDto,
      req.user.id, // 현재 로그인한 사용자의 ID를 전달
    );
  }

  @Patch('/change-role')
  @UsePipes(ValidationPipe)
  async changeMemberRole(
    @Body() changeMemberRoleDto: ChangeMemberRoleDto,
    @Req() req,
  ) {
    return await this.spaceMembersService.changeMemberRole(
      changeMemberRoleDto,
      req.user.id,
    );
  }

  @Get(':spaceId')
  async getAllMembersInSpace(@Param('spaceId') spaceId: number) {
    return await this.spaceMembersService.getAllMembersInSpace(spaceId);
  }
}
