import { IsNotEmpty, IsNumber } from "class-validator";

export class AddGroupMember {

  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @IsNumber()
  memberId: number;
}