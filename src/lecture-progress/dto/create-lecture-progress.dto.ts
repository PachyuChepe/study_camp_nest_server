import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLectureProgressDto {

  @IsNotEmpty()
  @IsNumber()
  lectureId: number;

  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsNumber()
  lectureCount: number;
}