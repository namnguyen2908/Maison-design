import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectStage } from './project-stage.entity';
import { DesignVersion } from './design-version.entity';

export enum RoomStatus {
  Pending = 'pending',
  InReview = 'in_review',
  ChangesRequested = 'changes_requested',
  Approved = 'approved',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectStage, (stage) => stage.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stageId' })
  stage: ProjectStage;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.Pending,
  })
  status: RoomStatus;

  @Column({ type: 'int', default: 0 })
  currentVersion: number;

  @OneToMany(() => DesignVersion, (version) => version.room, { cascade: true })
  versions: DesignVersion[];

  @CreateDateColumn()
  createdAt: Date;
}
