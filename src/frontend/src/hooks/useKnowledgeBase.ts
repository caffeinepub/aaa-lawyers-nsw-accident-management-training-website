import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Lesson } from '../backend';

export function useGetAllLessons() {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: async () => {
      if (!actor) return [];
      const courses = await actor.getAllCourses();
      const allLessons: Lesson[] = [];
      for (const course of courses) {
        const lessons = await actor.getLessonsByCourse(course.id);
        allLessons.push(...lessons);
      }
      return allLessons;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLesson(lessonId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson>({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLesson(lessonId);
    },
    enabled: !!actor && !isFetching && !!lessonId,
  });
}
