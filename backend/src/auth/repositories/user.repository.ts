import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserInput, IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash: input.passwordHash,
        displayName: input.displayName,
      },
    });
  }

  /** Enroll the new user in every published course automatically */
  async enrollInAllPublishedCourses(userId: string): Promise<void> {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true },
    });

    if (courses.length === 0) return;

    // Use createMany with skipDuplicates so re-running is safe
    await this.prisma.enrollment.createMany({
      data: courses.map((c) => ({ userId, courseId: c.id })),
      skipDuplicates: true,
    });
  }
}
