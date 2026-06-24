import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/permissions';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Permissions(Permission.UploadImage)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  uploadImage(@UploadedFile() file: any) {
    return this.uploadService.uploadImage(file);
  }
}
