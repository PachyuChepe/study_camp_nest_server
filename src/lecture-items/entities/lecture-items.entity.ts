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
import { Lecture } from '../../lectures/entities/lecture.entity';
// import { SpaceMember } from 'src/space-members/entities/space-member.entity'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리

@Entity('lecture_items')
export class LectureItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.lecture_items)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;
  @Column({ type: 'int', nullable: false })
  lecture_id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
