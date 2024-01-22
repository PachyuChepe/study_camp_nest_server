import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('dms')
export class Dm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.received_dms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receive_user_id' })
  receive_user: User;
  @Column()
  receive_user_id: number;

  @ManyToOne(() => User, (user) => user.sent_dms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'send_user_id' })
  send_user: User;
  @Column()
  send_user_id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
