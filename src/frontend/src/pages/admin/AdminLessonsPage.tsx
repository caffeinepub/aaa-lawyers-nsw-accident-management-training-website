import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit2 } from 'lucide-react';
import { useGetAllLessons, useGetAllCourses, useSaveLesson, useUpdateLesson, useSetContentStatus } from '../../hooks/useAdminContent';
import { ContentStatus } from '../../backend';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminLessonsPage() {
  const { data: lessons, isLoading: lessonsLoading } = useGetAllLessons();
  const { data: courses } = useGetAllCourses();
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveMutation = useSaveLesson();
  const updateMutation = useUpdateLesson();
  const setStatusMutation = useSetContentStatus();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    courseId: '',
    status: ContentStatus.draft,
  });

  const handleCreate = () => {
    setEditingLesson(null);
    setFormData({ id: '', title: '', content: '', courseId: '', status: ContentStatus.draft });
    setIsDialogOpen(true);
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      courseId: lesson.courseId,
      status: lesson.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.title.trim() || !formData.courseId.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const lessonData = {
        ...formData,
        pdfSource: new Uint8Array(0),
      };

      if (editingLesson) {
        await updateMutation.mutateAsync(lessonData);
        toast.success('Lesson updated successfully');
      } else {
        await saveMutation.mutateAsync(lessonData);
        toast.success('Lesson created successfully');
      }
      setIsDialogOpen(false);
      setFormData({ id: '', title: '', content: '', courseId: '', status: ContentStatus.draft });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lesson');
      console.error(error);
    }
  };

  const handleStatusChange = async (lessonId: string, status: ContentStatus) => {
    try {
      await setStatusMutation.mutateAsync({ contentId: lessonId, status, isCourse: false });
      toast.success('Lesson status updated');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  return (
    <div className="container py-12 md:py-16">
      <Link to="/admin">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Manage Lessons</h1>
          <p className="text-xl text-muted-foreground">Create and edit lesson content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Lesson ID *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., lesson-accident-reporting"
                  disabled={!!editingLesson}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Lesson title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseId">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Lesson content (supports plain text)"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ContentStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContentStatus.draft}>Draft</SelectItem>
                    <SelectItem value={ContentStatus.published}>Published</SelectItem>
                    <SelectItem value={ContentStatus.archived}>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending || updateMutation.isPending}>
                  {saveMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Lesson'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lessonsLoading ? (
        <div className="text-center py-12">Loading lessons...</div>
      ) : !lessons || lessons.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No lessons yet. Create your first lesson to get started.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const course = courses?.find((c) => c.id === lesson.courseId);
            return (
              <Card key={lesson.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{lesson.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{lesson.content}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={lesson.status === ContentStatus.published ? 'default' : 'outline'}>{lesson.status}</Badge>
                        <Badge variant="outline">Course: {course?.title || lesson.courseId}</Badge>
                        <Badge variant="outline">ID: {lesson.id}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Select
                      value={lesson.status}
                      onValueChange={(value) => handleStatusChange(lesson.id, value as ContentStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ContentStatus.draft}>Draft</SelectItem>
                        <SelectItem value={ContentStatus.published}>Published</SelectItem>
                        <SelectItem value={ContentStatus.archived}>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
