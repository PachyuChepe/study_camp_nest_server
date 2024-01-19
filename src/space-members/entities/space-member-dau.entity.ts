import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SpaceMember } from './space-member.entity';

// 만약 유저가 24시까지 퇴장안하고 있으면 어떻게 계산하지?
// node-schedule 23:59:59초에만 실행하는 함수 가질 수 있다.
@Entity('space_member_dau')
export class SpaceMemberDau {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => SpaceMember,
    (spaceMember) => spaceMember.space_member_daus,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'member_id' })
  space_member: SpaceMember;
  @Column({ type: 'int', nullable: false })
  member_id: number;

  @Column({ nullable: true })
  active_time: Date;

  @Column({ nullable: true })
  last_leave_time: Date;

  @Column()
  created_at: Date;
}
