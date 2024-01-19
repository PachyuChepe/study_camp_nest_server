import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateLectureProgressDto {

  @IsNotEmpty()
  @IsNumber()
  lectureProgressId: number;

  @IsNotEmpty()
  @IsNumber()
  lectureItemOrder: number;
}