import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
import type { AuthUser } from '../auth/types';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  findByUser(user: AuthUser): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string, user: AuthUser): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (notification) {
      notification.read = true;
      return this.notificationRepository.save(notification);
    }

    return notification as unknown as Notification;
  }

  async markAllAsRead(user: AuthUser): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: user.id }, read: false },
      { read: true },
    );
  }

  async create(
    userId: string,
    type: NotificationType,
    message: string,
    relatedUrl?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId } as any,
      type,
      message,
      relatedUrl: relatedUrl ?? null,
    });

    return this.notificationRepository.save(notification);
  }
}
