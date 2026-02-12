import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Course, Lesson } from '../backend';

export function useGetAllCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourse(courseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCourse(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useGetLessonsByCourse(courseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessonsByCourse(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
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
