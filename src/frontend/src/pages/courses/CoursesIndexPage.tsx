import { useGetAllCourses } from '../../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentStatus } from '../../backend';

export default function CoursesIndexPage() {
  const { data: courses, isLoading } = useGetAllCourses();

  const publishedCourses = courses?.filter((course) => course.status === ContentStatus.published) || [];

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Training Courses</h1>
        <p className="text-xl text-muted-foreground">
          Structured learning paths for accident management and insurance recovery in NSW
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : publishedCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
          <p className="text-muted-foreground">Training courses will appear here once published.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {publishedCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start gap-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <CardTitle className="mb-2">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>NSW</Badge>
                  <Badge variant="outline">Professional Training</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                  <Button className="w-full gap-2">
                    View Course
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
