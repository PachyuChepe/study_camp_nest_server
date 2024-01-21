import {
  IsNotEmpty,
  IsNumber,
  // IsOptional 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
} from 'class-validator';

export class AddMemberInSpaceDto {
  @IsNotEmpty()
  @IsNumber()
  spaceId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
