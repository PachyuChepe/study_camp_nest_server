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
import { Space } from 'src/spaces/entities/space.entity';
import { AlarmType } from '../types/alarm-type.type';

@Entity('alarms')
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Space, (space) => space.alarms)
  @JoinColumn({ name: 'space_id' })
  space: Space;
  @Column({ type: 'int', nullable: false })
  space_id: number;

  @Column({ type: 'enum', enum: AlarmType, default: AlarmType.Base })
  type: number;

  @Column()
  time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
