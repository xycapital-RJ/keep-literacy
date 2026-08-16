import { User } from '@prisma/client';

export interface CreateUserInput {
  email: string;
  username: string;
  passwordHash: string;
  displayName?: string;
}

/**
 * ISP: responsible only for user persistence lookups needed by auth.
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  enrollInAllPublishedCourses(userId: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
