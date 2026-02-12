import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, BookOpen, GraduationCap, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">Manage training content and course materials</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/admin/pdf-ingest">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50 h-full">
            <CardHeader>
              <FileUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle>PDF Import</CardTitle>
              <CardDescription>
                Upload and process PDF documents to create structured course content and knowledge base articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage PDF Import</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/courses">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50 h-full">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                Create, edit, and manage training courses including status changes and course organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Courses</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/lessons">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50 h-full">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Lessons</CardTitle>
              <CardDescription>
                Create and edit lesson content, attach lessons to courses, and manage rich text materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Lessons</Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-2 bg-muted/30">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle className="text-muted-foreground">Knowledge Base</CardTitle>
            <CardDescription>
              Knowledge base articles are managed through the Lessons interface with appropriate categorization
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
