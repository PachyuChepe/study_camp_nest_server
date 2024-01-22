import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Space } from 'src/spaces/entities/space.entity';
import { GroupMember } from '../../group-members/entities/group-members.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Space, (space) => space.groups)
  @JoinColumn({ name: 'space_id' })
  space: Space;
  @Column({ type: 'int', nullable: false })
  space_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group, {
    onDelete: 'CASCADE',
  })
  group_members: GroupMember[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
