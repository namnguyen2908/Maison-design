import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { ProjectStage } from './entities/project-stage.entity';
import { Room, RoomStatus } from './entities/room.entity';
import { DesignVersion } from './entities/design-version.entity';
import { DesignImage } from './entities/design-image.entity';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UploadDesignDto } from './dto/upload-design.dto';
import type { AuthUser } from '../auth/types';
import { RoleName } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectStage)
    private readonly stageRepository: Repository<ProjectStage>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(DesignVersion)
    private readonly versionRepository: Repository<DesignVersion>,
    @InjectRepository(DesignImage)
    private readonly imageRepository: Repository<DesignImage>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(user: AuthUser): Promise<Project[]> {
    if (user.role === RoleName.Customer) {
      return this.projectRepository.find({
        where: { client: { id: user.id } },
        relations: { stages: true },
        order: { createdAt: 'DESC' },
      });
    }

    if (user.role === RoleName.Designer) {
      return this.projectRepository.find({
        where: { assignedDesigner: { id: user.id } },
        relations: { stages: true },
        order: { createdAt: 'DESC' },
      });
    }

    return this.projectRepository.find({
      relations: { stages: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, user: AuthUser): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: {
        stages: { rooms: { versions: { images: true, uploadedBy: true } } },
        client: true,
        assignedDesigner: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role === RoleName.Customer &&
      project.client.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    return project;
  }

  async create(dto: CreateProjectDto, user: AuthUser): Promise<Project> {
    const client = await this.usersService.findByEmail(dto.clientEmail);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    let assignedDesigner: User | null = null;

    if (dto.assignedDesignerEmail) {
      assignedDesigner = await this.usersService.findByEmail(
        dto.assignedDesignerEmail,
      );

      if (!assignedDesigner) {
        throw new NotFoundException('Designer not found');
      }
    }

    const project = this.projectRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      address: dto.address ?? null,
      client,
      assignedDesigner,
      status: ProjectStatus.Pending,
    });

    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    user: AuthUser,
  ): Promise<Project> {
    const project = await this.findById(id, user);

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.address !== undefined) project.address = dto.address;
    if (dto.status !== undefined) project.status = dto.status;

    if (dto.assignedDesignerEmail !== undefined) {
      const designer = await this.usersService.findByEmail(
        dto.assignedDesignerEmail,
      );
      if (!designer) {
        throw new NotFoundException('Designer not found');
      }
      project.assignedDesigner = designer;
    }

    return this.projectRepository.save(project);
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const project = await this.findById(id, user);
    await this.projectRepository.softDelete(project.id);
  }

  async addStage(
    projectId: string,
    dto: CreateStageDto,
    user: AuthUser,
  ): Promise<ProjectStage> {
    const project = await this.findById(projectId, user);

    const stage = this.stageRepository.create({
      project,
      name: dto.name,
      order: dto.order ?? 0,
      checklist: dto.checklist ?? null,
    });

    return this.stageRepository.save(stage);
  }

  async updateStage(
    projectId: string,
    stageId: string,
    dto: UpdateStageDto,
    user: AuthUser,
  ): Promise<ProjectStage> {
    await this.findById(projectId, user);

    const stage = await this.stageRepository.findOne({
      where: { id: stageId, project: { id: projectId } },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    if (dto.name !== undefined) stage.name = dto.name;
    if (dto.order !== undefined) stage.order = dto.order;
    if (dto.status !== undefined) stage.status = dto.status;
    if (dto.checklist !== undefined) stage.checklist = dto.checklist;

    return this.stageRepository.save(stage);
  }

  async removeStage(
    projectId: string,
    stageId: string,
    user: AuthUser,
  ): Promise<void> {
    await this.findById(projectId, user);

    const stage = await this.stageRepository.findOne({
      where: { id: stageId, project: { id: projectId } },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    await this.stageRepository.remove(stage);
  }

  async addRoom(
    projectId: string,
    stageId: string,
    dto: CreateRoomDto,
    user: AuthUser,
  ): Promise<Room> {
    await this.findById(projectId, user);

    const stage = await this.stageRepository.findOne({
      where: { id: stageId, project: { id: projectId } },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    const room = this.roomRepository.create({
      stage,
      name: dto.name,
    });

    return this.roomRepository.save(room);
  }

  async updateRoom(
    stageId: string,
    roomId: string,
    dto: UpdateRoomDto,
    user: AuthUser,
  ): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, stage: { id: stageId } },
      relations: { stage: { project: true } },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    this.ensureProjectAccess(room.stage.project, user);

    if (dto.name !== undefined) room.name = dto.name;
    if (dto.status !== undefined) room.status = dto.status;

    return this.roomRepository.save(room);
  }

  async removeRoom(
    stageId: string,
    roomId: string,
    user: AuthUser,
  ): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, stage: { id: stageId } },
      relations: { stage: { project: true } },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    this.ensureProjectAccess(room.stage.project, user);
    await this.roomRepository.remove(room);
  }

  async approveRoom(roomId: string, user: AuthUser): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { stage: { project: { client: true } } },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (
      user.role === RoleName.Customer &&
      room.stage.project.client.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    room.status = RoomStatus.Approved;
    return this.roomRepository.save(room);
  }

  async uploadDesign(
    roomId: string,
    dto: UploadDesignDto,
    imageData: {
      url: string;
      publicId: string;
      originalName: string;
      width: number;
      height: number;
    },
    user: AuthUser,
  ): Promise<DesignVersion> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { stage: { project: true } },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const nextVersion = room.currentVersion + 1;

    const version = this.versionRepository.create({
      room,
      versionNumber: nextVersion,
      notes: dto.notes ?? null,
      uploadedBy: { id: user.id } as any,
      images: [
        this.imageRepository.create({
          url: imageData.url,
          publicId: imageData.publicId,
          originalName: imageData.originalName,
          width: imageData.width,
          height: imageData.height,
          sortOrder: 0,
        }),
      ],
    });

    const saved = await this.versionRepository.save(version);

    room.currentVersion = nextVersion;
    room.status = RoomStatus.InReview;
    await this.roomRepository.save(room);

    return saved;
  }

  async getDesignVersions(roomId: string, user: AuthUser): Promise<DesignVersion[]> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { stage: { project: true } },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    this.ensureProjectAccess(room.stage.project, user);

    return this.versionRepository.find({
      where: { room: { id: roomId } },
      relations: { images: true, uploadedBy: true },
      order: { versionNumber: 'DESC' },
    });
  }

  async getDesignVersion(
    designId: string,
    user: AuthUser,
  ): Promise<DesignVersion> {
    const version = await this.versionRepository.findOne({
      where: { id: designId },
      relations: {
        room: { stage: { project: true } },
        images: true,
        uploadedBy: true,
      },
    });

    if (!version) {
      throw new NotFoundException('Design version not found');
    }

    this.ensureProjectAccess(version.room.stage.project, user);

    return version;
  }

  private ensureProjectAccess(project: Project, user: AuthUser): void {
    if (
      user.role === RoleName.Customer &&
      project.client?.id !== user.id
    ) {
      throw new ForbiddenException();
    }
  }
}
