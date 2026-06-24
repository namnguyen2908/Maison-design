import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectStage } from './entities/project-stage.entity';
import { Room } from './entities/room.entity';
import { DesignVersion } from './entities/design-version.entity';
import { DesignImage } from './entities/design-image.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectStage,
      Room,
      DesignVersion,
      DesignImage,
    ]),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
