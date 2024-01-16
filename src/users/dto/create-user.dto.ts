// src/users/dto/create-user.dto.ts

import { SkinType } from '../types/user-skin.type';
import { HairType } from '../types/user-hiar.type';
import { FaceType } from '../types/user-face.type';
import { ClothesType } from '../types/user-clothes.type';
import { ClothesColorType } from '../types/user-clothes-color.type';
import { HairColorType } from '../types/user-hiar-color.type';

export class CreateUserDto {
  email: string;
  password?: string;
  nick_name: string;
  point: number;
  skin?: SkinType;
  hair?: HairType;
  face?: FaceType;
  clothes?: ClothesType;
  hair_color?: HairColorType;
  clothes_color?: ClothesColorType;
}
