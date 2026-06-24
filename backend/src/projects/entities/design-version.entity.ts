import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../users/entities/user.entity';
import { DesignImage } from './design-image.entity';

@Entity('design_versions')
export class DesignVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ type: 'int' })
  versionNumber: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @OneToMany(() => DesignImage, (image) => image.version, { cascade: true })
  images: DesignImage[];

  @CreateDateColumn()
  createdAt: Date;
}
