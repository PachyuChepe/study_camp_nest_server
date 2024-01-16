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
  Request,
  UseGuards,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  //학습공간을 만듭니다.
  @Post()
  @UsePipes(ValidationPipe)
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    return await this.spacesService.createSpace(createSpaceDto);
  }

  //학슬공간을 삭제합니다.
  @Delete()
  async deleteSpaceByName( name: string ) {
    return await this.spacesService.deleteSpace(name);
  }

  //TODO: 어떻게 유저 정보 얻어오는지 알아오기
  //유저 정보는 어디서 얻어올 것인가. 일단 여기서 얻는 것은 안된다. 여기는 space만을 위한 컨트롤러이기 때문이다.
  //가드인가 데코레이터인가 일단 user:any로 해놓아야지
  //유저 정보를 통해 학습공간을 찾습니다. -> 유저가 속한 학습공간을 모두 찾기 위한 것입니다.
  //GetUserDecorator?
  @Get()
  async findSpacesByUser(user: any, @Request() req){
    return await this.spacesService.findSpacesByUser(req.user)
  }
}
