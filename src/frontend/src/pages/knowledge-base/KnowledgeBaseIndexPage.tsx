import { useState } from 'react';
import { useGetAllLessons } from '../../hooks/useKnowledgeBase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { BookOpen, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentStatus } from '../../backend';

const categories = [
  { id: 'all', label: 'All Articles', color: 'default' },
  { id: 'accident-management', label: 'Accident Management Systems (NSW)', color: 'default' },
  { id: 'recovery', label: 'Recovery from At-Fault Insurer (NSW)', color: 'default' },
  { id: 'insurance', label: 'Dealing with Insurance Companies (NSW)', color: 'default' },
];

export default function KnowledgeBaseIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: lessons, isLoading } = useGetAllLessons();

  const publishedLessons = lessons?.filter((lesson) => lesson.status === ContentStatus.published) || [];

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Knowledge Base</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive resources on accident management and insurance recovery in NSW, Australia
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            size="sm"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : publishedLessons.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
          <p className="text-muted-foreground">Knowledge base articles will appear here once published.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedLessons.map((lesson) => (
            <Link key={lesson.id} to="/knowledge-base/$articleId" params={{ articleId: lesson.id }}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-2 mb-2">{lesson.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {lesson.content.substring(0, 150)}...
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">NSW</Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
