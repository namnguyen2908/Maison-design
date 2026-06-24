import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignVersion } from './design-version.entity';

@Entity('design_images')
export class DesignImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DesignVersion, (version) => version.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'versionId' })
  version: DesignVersion;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  publicId: string;

  @Column({ type: 'varchar', length: 50 })
  originalName: string;

  @Column({ type: 'int', default: 0 })
  width: number;

  @Column({ type: 'int', default: 0 })
  height: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
