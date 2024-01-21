import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLectureItemsDto {
  @IsNotEmpty()
  @IsNumber()
  lectureId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
