// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';
import { SkinType } from '../types/user-skin.type';
import { HairType } from '../types/user-hiar.type';
import { FaceType } from '../types/user-face.type';
import { ClothesType } from '../types/user-clothes.type';
import { ClothesColorType } from '../types/user-clothes-color.type';
import { HairColorType } from '../types/user-hiar-color.type';
import { Space } from 'src/spaces/entities/space.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  nick_name: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @Column({ type: 'enum', enum: SkinType, default: SkinType.Base })
  skin: number;

  @Column({ type: 'enum', enum: HairType, default: HairType.Base })
  hair: number;

  @Column({ type: 'enum', enum: FaceType, default: FaceType.Base })
  face: number;

  @Column({ type: 'enum', enum: ClothesType, default: ClothesType.Base })
  clothes: number;

  @Column({ type: 'enum', enum: HairColorType, default: HairColorType.Base })
  hair_color: number;

  @Column({
    type: 'enum',
    enum: ClothesColorType,
    default: ClothesColorType.Base,
  })
  clothes_color: number;

  @OneToMany(() => SpaceMember, (spaceMember) => spaceMember.user, {
    onDelete: 'CASCADE',
  })
  space_members: SpaceMember[];

  @OneToMany(() => Space, (space) => space.user, { onDelete: 'CASCADE' })
  space: Space[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
