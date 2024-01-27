import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMemberInSpaceDto {
  @IsNotEmpty()
  @IsNumber()
  spaceId: number;
}
