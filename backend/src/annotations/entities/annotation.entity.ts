import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignVersion } from '../../projects/entities/design-version.entity';
import { DesignImage } from '../../projects/entities/design-image.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';

export enum AnnotationStatus {
  Pending = 'pending',
  Resolved = 'resolved',
  Reopened = 'reopened',
}

@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DesignVersion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'designVersionId' })
  designVersion: DesignVersion;

  @Column({ type: 'float' })
  x: number;

  @Column({ type: 'float' })
  y: number;

  @ManyToOne(() => DesignImage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'targetImageId' })
  targetImage: DesignImage | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referenceImageUrl: string | null;

  @Column({
    type: 'enum',
    enum: AnnotationStatus,
    default: AnnotationStatus.Pending,
  })
  status: AnnotationStatus;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => Comment, (comment) => comment.annotation, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
