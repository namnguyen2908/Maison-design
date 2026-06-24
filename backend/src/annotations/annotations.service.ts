import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation, AnnotationStatus } from './entities/annotation.entity';
import { Comment } from './entities/comment.entity';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateAnnotationStatusDto } from './dto/update-annotation-status.dto';
import type { AuthUser } from '../auth/types';
import { DesignVersion } from '../projects/entities/design-version.entity';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private readonly annotationRepository: Repository<Annotation>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findByDesignVersion(designVersionId: string): Promise<Annotation[]> {
    return this.annotationRepository.find({
      where: { designVersion: { id: designVersionId } },
      relations: {
        comments: { user: true },
        createdBy: true,
        targetImage: true,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async create(
    designVersionId: string,
    dto: CreateAnnotationDto,
    user: AuthUser,
  ): Promise<Annotation> {
    const annotation = this.annotationRepository.create({
      designVersion: { id: designVersionId } as DesignVersion,
      x: dto.x,
      y: dto.y,
      targetImage: dto.targetImageId
        ? ({ id: dto.targetImageId } as any)
        : null,
      referenceImageUrl: dto.referenceImageUrl ?? null,
      createdBy: { id: user.id } as any,
      status: AnnotationStatus.Pending,
    });

    return this.annotationRepository.save(annotation);
  }

  async updateStatus(
    id: string,
    dto: UpdateAnnotationStatusDto,
  ): Promise<Annotation> {
    const annotation = await this.annotationRepository.findOne({
      where: { id },
    });

    if (!annotation) {
      throw new NotFoundException('Annotation not found');
    }

    annotation.status = dto.status;
    return this.annotationRepository.save(annotation);
  }

  async addComment(
    annotationId: string,
    dto: CreateCommentDto,
    user: AuthUser,
  ): Promise<Comment> {
    const annotation = await this.annotationRepository.findOne({
      where: { id: annotationId },
    });

    if (!annotation) {
      throw new NotFoundException('Annotation not found');
    }

    const comment = this.commentRepository.create({
      annotation,
      user: { id: user.id } as any,
      content: dto.content,
    });

    return this.commentRepository.save(comment);
  }
}
