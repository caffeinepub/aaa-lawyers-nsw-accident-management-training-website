import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Course, Lesson, ContentStatus } from '../backend';

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

export function useSaveCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCourse(course);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCourse(course);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useSaveLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLesson(lesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useUpdateLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLesson(lesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useSetContentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      status,
      isCourse,
    }: {
      contentId: string;
      status: ContentStatus;
      isCourse: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setContentStatus(contentId, status, isCourse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
