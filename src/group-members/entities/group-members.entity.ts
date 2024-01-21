import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.group_members)
  @JoinColumn({ name: 'group_id' })
  group: Group;
  @Column({ type: 'int', nullable: false })
  group_id: number;

  @ManyToOne(() => SpaceMember, (spaceMember) => spaceMember.group_members)
  @JoinColumn({ name: 'member_id' })
  space_member: SpaceMember;
  @Column({ type: 'int', nullable: false })
  member_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
