import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  // Index, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Space } from 'src/spaces/entities/space.entity';
import { SpaceMemberDau } from './space-member-dau.entity';
import { GroupMember } from 'src/group-members/entities/group-members.entity';
import { LectureProgress } from 'src/lecture-progress/dto/entities/lecture-progress.entity';
import { Mail } from 'src/mails/entities/mail.entity';
import { SpaceMemberRole } from '../types/space-member-role.type';

@Entity('space_members')
export class SpaceMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.space_members)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => Space, (space) => space.spaceMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id' })
  space: Space;
  @Column({ type: 'int', nullable: false })
  space_id: number;

  @Column({
    type: 'enum',
    enum: SpaceMemberRole,
    default: SpaceMemberRole.Mentee,
  })
  role: SpaceMemberRole;

  @OneToMany(
    () => SpaceMemberDau,
    (spaceMemberDau) => spaceMemberDau.space_member,
  )
  space_member_daus: SpaceMemberDau[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.space_member, {
    onDelete: 'CASCADE',
  })
  group_members: SpaceMemberDau[];

  @OneToMany(
    () => LectureProgress,
    (lectureProgress) => lectureProgress.space_member,
    { onDelete: 'CASCADE' },
  )
  lecture_progresses: LectureProgress[];

  @OneToMany(() => Mail, (mail) => mail.space_member, { onDelete: 'CASCADE' })
  mails: Mail[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
