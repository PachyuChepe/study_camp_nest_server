import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Lecture } from '../../lectures/entities/lecture.entity';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';

@Entity('lecture_progress')
export class LectureProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.lecture_progresses)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;
  @Column({ type: 'int', nullable: false })
  lecture_id: number;

  @ManyToOne(() => SpaceMember, (spaceMember) => spaceMember.lecture_progresses)
  @JoinColumn({ name: 'member_id' })
  space_member: SpaceMember;
  @Column({ type: 'int', nullable: false })
  member_id: number;

  //TODO 몇자리까지 저장할 것인가?
  @Column({ type: 'double', default: 0 })
  progress: number;

  //TODO 배열 검증이 필요하다 그러나 어떻게 하는지 아직 모른다. 따로 해야하나
  @Column({ type: 'varchar'})
  checker: string;
}
