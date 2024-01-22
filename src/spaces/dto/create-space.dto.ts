import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly userId: number;
  // userId를 body로 받는게 아닌 req.user.id로 받게 수정 -> 결제하는 당사자가 해당 스페이스의 소유권자가 됨

  @IsNotEmpty()
  @IsNumber()
  readonly classId: number;
}
