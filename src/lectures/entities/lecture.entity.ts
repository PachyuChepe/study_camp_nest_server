import { Space } from 'src/spaces/entities/space.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LectureItem } from '../../lecture-items/entities/lecture-items.entity';
import { LectureProgress } from '../../lecture-progress/dto/entities/lecture-progress.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Space, (space) => space.lectures)
  @JoinColumn({ name: 'space_id' })
  space: Space;
  @Column({ type: 'int', nullable: false })
  space_id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'int', nullable: false })
  count: number;

  @OneToMany(
    () => LectureProgress,
    (lectureProgress) => lectureProgress.lecture,
    {
      onDelete: 'CASCADE',
    },
  )
  lecture_progresses: LectureProgress[];

  @OneToMany(() => LectureItem, (lectureItem) => lectureItem.lecture, {
    onDelete: 'CASCADE',
  })
  lecture_items: LectureItem[];
}
