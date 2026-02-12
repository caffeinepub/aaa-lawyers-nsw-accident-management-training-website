import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TraineeProgress } from '../backend';

export function useGetTraineeProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<TraineeProgress>({
    queryKey: ['traineeProgress'],
    queryFn: async () => {
      if (!actor) return { completedLessons: [], enrolledCourses: [] };
      return actor.getTraineeProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkLessonCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markLessonCompleted(lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traineeProgress'] });
    },
  });
}

export function useEnrollInCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enrollInCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traineeProgress'] });
    },
  });
}
