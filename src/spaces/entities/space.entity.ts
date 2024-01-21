import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  // OneToOne, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';
import { SpaceClass } from './space-class.entity';
import { Group } from 'src/group/entities/group.entity';
import { Lecture } from 'src/lectures/entities/lecture.entity';
import { Alarm } from 'src/alarms/entities/alarm.entity';
import { User } from 'src/users/entities/user.entity';

// ERD물어봐야 함.
@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: 둘다 1:1 이라고?? 다시 물어봐야지
  @ManyToOne(() => User, (user) => user.space)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  // 여기도 문제 있었음 코드 실행시
  @ManyToOne(() => SpaceClass, (spaceClass) => spaceClass.space)
  @JoinColumn({ name: 'class_id' })
  space_class: SpaceClass;
  @Column({ type: 'int', name: 'class_id' })
  class_id: number;

  // TODO: 이거 유니크한 값인지 물어봐야 한다.
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => SpaceMember, (spaceMember) => spaceMember.space, {
    onDelete: 'CASCADE',
  })
  spaceMembers: SpaceMember[];

  @OneToMany(() => Group, (group) => group.space, { onDelete: 'CASCADE' })
  groups: Group[];

  @OneToMany(() => Lecture, (lecture) => lecture.space, { onDelete: 'CASCADE' })
  lectures: Lecture[];

  @OneToMany(() => Alarm, (alarm) => alarm.space, { onDelete: 'CASCADE' })
  alarms: Alarm[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
