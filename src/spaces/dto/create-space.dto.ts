import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly classId: number;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
