import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetLesson, useGetLessonsByCourse, useGetCourse } from '../../hooks/useCourses';
import { useGetTraineeProgress, useMarkLessonCompleted } from '../../hooks/useProgress';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ContentStatus } from '../../backend';

export default function LessonPage() {
  const { courseId, lessonId } = useParams({ from: '/courses/$courseId/lesson/$lessonId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: lesson, isLoading: lessonLoading } = useGetLesson(lessonId);
  const { data: course } = useGetCourse(courseId);
  const { data: courseLessons } = useGetLessonsByCourse(courseId);
  const { data: progress } = useGetTraineeProgress();
  const markCompletedMutation = useMarkLessonCompleted();

  const isAuthenticated = !!identity;
  const isCompleted = progress?.completedLessons.includes(lessonId) || false;

  const publishedLessons = courseLessons?.filter((l) => l.status === ContentStatus.published) || [];
  const currentIndex = publishedLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex >= 0 && currentIndex < publishedLessons.length - 1 ? publishedLessons[currentIndex + 1] : null;

  const handleMarkCompleted = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to track your progress');
      return;
    }
    try {
      await markCompletedMutation.mutateAsync(lessonId);
      toast.success('Lesson marked as completed!');
    } catch (error) {
      toast.error('Failed to mark lesson as completed');
      console.error(error);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate({ to: '/courses/$courseId/lesson/$lessonId', params: { courseId, lessonId: nextLesson.id } });
    }
  };

  if (lessonLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container py-12 md:py-16">
        <Link to="/courses/$courseId" params={{ courseId }}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Lesson Not Found</h3>
          <p className="text-muted-foreground">The lesson you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Link to="/courses/$courseId" params={{ courseId }}>
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {course?.title || 'Course'}
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge>Lesson {currentIndex + 1}</Badge>
            {isCompleted && (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{lesson.title}</h1>
        </header>

        <Card className="mb-8">
          <CardContent className="prose prose-lg dark:prose-invert max-w-none pt-6">
            <div className="whitespace-pre-wrap">{lesson.content}</div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            {isAuthenticated && !isCompleted && (
              <Button onClick={handleMarkCompleted} disabled={markCompletedMutation.isPending} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {markCompletedMutation.isPending ? 'Marking Complete...' : 'Mark as Complete'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {nextLesson && (
              <Button onClick={handleNext} className="gap-2">
                Next Lesson
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
