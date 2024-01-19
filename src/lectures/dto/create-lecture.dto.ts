import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLectureDto {

  @IsNotEmpty()
  @IsNumber()
  spaceId: number;

  @IsNotEmpty()
  @IsNotEmpty()
  title: string;

}
