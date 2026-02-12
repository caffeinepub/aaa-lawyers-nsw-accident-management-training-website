import { useParams, Link } from '@tanstack/react-router';
import { useGetLesson } from '../../hooks/useKnowledgeBase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleDetailPage() {
  const { articleId } = useParams({ from: '/knowledge-base/$articleId' });
  const { data: lesson, isLoading, error } = useGetLesson(articleId);

  if (isLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-24 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container py-12 md:py-16">
        <Link to="/knowledge-base">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Article Not Found</h3>
          <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Link to="/knowledge-base">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Knowledge Base
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{lesson.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge>NSW</Badge>
            <Badge variant="outline">Accident Management</Badge>
          </div>
        </header>

        <Card>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none pt-6">
            <div className="whitespace-pre-wrap">{lesson.content}</div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
