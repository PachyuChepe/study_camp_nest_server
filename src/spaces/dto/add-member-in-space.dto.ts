import { IsNotEmpty, IsString } from "class-validator";

export class AddMemberInSpaceDto {
  @IsNotEmpty()
  @IsString()
  spaceName: string;

  @IsNotEmpty()
  @IsString()
  userEmail: string;

}