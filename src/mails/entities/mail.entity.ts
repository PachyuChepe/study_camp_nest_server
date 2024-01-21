import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';

@Entity('mails')
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SpaceMember, (spaceMember) => spaceMember.mails)
  @JoinColumn({ name: 'member_id' })
  space_member: SpaceMember;
  @Column({ type: 'int', nullable: false })
  member_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
