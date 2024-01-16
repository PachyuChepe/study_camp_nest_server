import { IsNotEmpty, IsNumber } from "class-validator";

export class AddMemberInSpaceDto {
  @IsNotEmpty()
  @IsNumber()
  spaceId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

}