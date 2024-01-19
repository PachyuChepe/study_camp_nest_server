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
  async addMemberInSpace(@Body() addMemberInSpaceDto: AddMemberInSpaceDto){
    return await this.spaceMembersService.addMemberInSpace(addMemberInSpaceDto);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteMemberInSpace(@Body() deleteMemberInSpaceDto: DeleteMemberInSpaceDto) {
    return await this.spaceMembersService.deleteMemberInSpace(deleteMemberInSpaceDto);
  }
}
