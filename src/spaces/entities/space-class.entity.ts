import { Entity, PrimaryGeneratedColumn, OneToOne, Column, OneToMany } from 'typeorm';
import { Space } from './space.entity';

@Entity('space_class')
export class SpaceClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  capacity: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @OneToMany(() => Space, (space) => space.space_class)
  space: Space[];
}
