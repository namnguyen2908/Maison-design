import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Room } from './room.entity';

export enum StageStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
}

@Entity('project_stages')
export class ProjectStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.stages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({
    type: 'enum',
    enum: StageStatus,
    default: StageStatus.Pending,
  })
  status: StageStatus;

  @Column({ type: 'json', nullable: true })
  checklist: { text: string; done: boolean }[] | null;

  @OneToMany(() => Room, (room) => room.stage, { cascade: true })
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;
}
