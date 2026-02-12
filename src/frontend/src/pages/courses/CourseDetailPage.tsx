import { useParams, Link } from '@tanstack/react-router';
import { useGetCourse, useGetLessonsByCourse } from '../../hooks/useCourses';
import { useGetTraineeProgress, useEnrollInCourse } from '../../hooks/useProgress';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Circle, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ContentStatus } from '../../backend';

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const { identity } = useInternetIdentity();
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: lessons, isLoading: lessonsLoading } = useGetLessonsByCourse(courseId);
  const { data: progress } = useGetTraineeProgress();
  const enrollMutation = useEnrollInCourse();

  const isAuthenticated = !!identity;
  const isEnrolled = progress?.enrolledCourses.includes(courseId) || false;
  const publishedLessons = lessons?.filter((lesson) => lesson.status === ContentStatus.published) || [];

  const completedLessonsCount = publishedLessons.filter((lesson) =>
    progress?.completedLessons.includes(lesson.id)
  ).length;
  const progressPercentage =
    publishedLessons.length > 0 ? Math.round((completedLessonsCount / publishedLessons.length) * 100) : 0;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to enroll in courses');
      return;
    }
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
      console.error(error);
    }
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-12 md:py-16">
        <Link to="/courses">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Course Not Found</h3>
          <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Link to="/courses">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge>NSW</Badge>
            <Badge variant="outline">Professional Training</Badge>
          </div>
        </header>

        {isAuthenticated && isEnrolled && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {completedLessonsCount} of {publishedLessons.length} lessons completed
                  </span>
                  <span className="font-semibold">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && !isEnrolled && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Ready to start learning?</h3>
                  <p className="text-sm text-muted-foreground">Enroll in this course to track your progress</p>
                </div>
                <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>
              {publishedLessons.length} {publishedLessons.length === 1 ? 'lesson' : 'lessons'} in this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {publishedLessons.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No lessons available yet</p>
            ) : (
              <div className="space-y-3">
                {publishedLessons.map((lesson, index) => {
                  const isCompleted = progress?.completedLessons.includes(lesson.id) || false;
                  return (
                    <Link key={lesson.id} to="/courses/$courseId/lesson/$lessonId" params={{ courseId, lessonId: lesson.id }}>
                      <div className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">Lesson {index + 1}</span>
                            {isCompleted && <Badge variant="outline">Completed</Badge>}
                          </div>
                          <h4 className="font-semibold">{lesson.title}</h4>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
