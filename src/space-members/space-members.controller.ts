import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SpaceMembersService } from './space-members.service';
import { CreateSpaceMemberDto } from './dto/create-space-member.dto';
import { UpdateSpaceMemberDto } from './dto/update-space-member.dto';
import { AddMemberInSpaceDto } from './dto/add-member-in-space.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DeleteMemberInSpaceDto } from './dto/delete-member-in-space.dto';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('space-members')
export class SpaceMembersController {
  constructor(private readonly spaceMembersService: SpaceMembersService) {}

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
}
