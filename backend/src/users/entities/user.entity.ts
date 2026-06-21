import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

export enum AuthProvider {
  Local = 'local',
  Google = 'google',
  Facebook = 'facebook',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.Local })
  provider: AuthProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
