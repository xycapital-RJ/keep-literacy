export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  CourseDetail: { courseId: string; courseTitle: string };
  Lesson: { lessonId: string; lessonTitle: string };
  Scenario: { scenarioId: string };
};
