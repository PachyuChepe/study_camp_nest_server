import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Space } from 'src/spaces/entities/space.entity';
import { SpaceMemberDau } from './space-member-dau.entity';
import { GroupMember } from 'src/group-members/entities/group-members.entity';
import { LectureProgress } from 'src/lectures/entities/lecture-progress.entity';
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

  @ManyToOne(() => Space, (space) => space.spaceMembers, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'space_id' })
  space: Space;
  @Column({ type: 'int', nullable: false })
  space_id: number;

  @Column({
    type: 'enum',
    enum: SpaceMemberRole,
    default: SpaceMemberRole.Mentee,
  })
  role: number;

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
}
