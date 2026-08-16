import { Course, Lesson, Module } from '@prisma/client';

export type ModuleWithLessons = Module & { lessons: Lesson[] };
export type CourseWithModules = Course & { modules: ModuleWithLessons[] };

export interface ICourseRepository {
  findAllPublished(): Promise<Course[]>;
  findByIdWithModulesAndLessons(id: string): Promise<CourseWithModules | null>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
