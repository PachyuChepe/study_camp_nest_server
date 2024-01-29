import {
  IsNotEmpty,
  IsNumber,
  IsString,
  // IsString 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
} from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsNumber()
  spaceId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}
