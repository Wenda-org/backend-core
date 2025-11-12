import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      bio: user.bio,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: any) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
