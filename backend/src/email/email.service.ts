import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {}

  async sendNewCommentNotification(
    _to: string,
    _data: {
      clientName: string;
      projectName: string;
      comment: string;
      link: string;
    },
  ): Promise<void> {
  }

  async sendNewVersionNotification(
    _to: string,
    _data: {
      designerName: string;
      projectName: string;
      roomName: string;
      version: number;
      link: string;
    },
  ): Promise<void> {
  }
}
