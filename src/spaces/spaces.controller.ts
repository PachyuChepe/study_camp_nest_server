import {
  Controller,
  Get,
  Post,
  Body,
  // Patch, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  // Param, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  Delete,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
// import { UpdateSpaceDto } from './dto/update-space.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get('/all')
  async findAllSpaces() {
    const data = await this.spacesService.findAllSpaces();
    console.log('잘 나와주세요 =====>', data);
    return data;
  }

  // 학습공간을 만듭니다.
  @Post()
  @UsePipes(ValidationPipe)
  async createSpace(@Request() req, @Body() createSpaceDto: CreateSpaceDto) {
    // 요청 객체에서 사용자 ID 추출
    const userId = req.user.id;

    return await this.spacesService.createSpace(
      createSpaceDto.name,
      createSpaceDto.classId,
      createSpaceDto.content,
      createSpaceDto.password,
      userId,
    );
  }

  // 학슬공간을 삭제합니다.
  @Delete()
  async deleteSpaceByName(@Body('name') name: string, @Request() req) {
    return await this.spacesService.deleteSpace(name, req.user.id);
  }

  // TODO: 어떻게 유저 정보 얻어오는지 알아오기
  // 유저 정보는 어디서 얻어올 것인가. 일단 여기서 얻는 것은 안된다. 여기는 space만을 위한 컨트롤러이기 때문이다.
  // 가드인가 데코레이터인가 일단 user:any로 해놓아야지
  // 유저 정보를 통해 학습공간을 찾습니다. -> 유저가 속한 학습공간을 모두 찾기 위한 것입니다.
  // GetUserDecorator?
  // @Get()
  // async findSpacesByUser(user: any, @Request() req) {
  //   return await this.spacesService.findSpacesByUser(req.user);
  // }

  @Get()
  async findMemberSpaces(@Request() req) {
    return await this.spacesService.findSpacesByMember(req.user.id);
  }
  @Get('/classes')
  async getAllSpaceClasses() {
    return await this.spacesService.findAllSpaceClasses();
  }

  @Get('/:spaceId')
  async getAllMemberBySpaceId(@Param('spaceId') spaceId: number) {
    const result: any = await this.spacesService.getAllMemberBySpaceId(spaceId);
    result.spaceMembers.forEach((spaceMember) => {
      spaceMember.user = {
        id: spaceMember.user.id,
        nick_name: spaceMember.user.nick_name,
      };
    });
    return result;
  }

  @Post('/check-user')
  async isUserSpace(@Request() req, @Body('spaceId') spaceId: string) {
    const data = await this.spacesService.isUserSpace(req.user.id, +spaceId);
    return data;
  }

  // 초대 코드 생성
  @Get('/invitation/:spaceId')
  async createInvitngCode(@Param('spaceId') spaceId: string, @Request() req) {
    const data = await this.spacesService.createInvitngCode(
      +spaceId,
      req.user.id,
    );
    return { code: data };
  }

  // 초대 코드 검증
  @Post('/invitation/check')
  async checkInvitingCode(@Body('code') code: string, @Request() req) {
    return await this.spacesService.checkInvitingCode(req.user.id, code);
  }

  // 스페이스 비밀번호 검증
  @Post('/invitation/password')
  async checkInvitingPassword(@Body() body, @Request() req) {
    const spaceId = body.spaceId;
    const password = body.password;
    return await this.spacesService.checkInvitingPassword(
      req.user.id,
      spaceId,
      password,
    );
  }
}
