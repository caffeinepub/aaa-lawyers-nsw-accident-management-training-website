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
import { useGetAllCourses, useSaveCourse, useUpdateCourse, useSetContentStatus } from '../../hooks/useAdminContent';
import { ContentStatus } from '../../backend';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminCoursesPage() {
  const { data: courses, isLoading } = useGetAllCourses();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveMutation = useSaveCourse();
  const updateMutation = useUpdateCourse();
  const setStatusMutation = useSetContentStatus();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: ContentStatus.draft,
  });

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({ id: '', title: '', description: '', status: ContentStatus.draft });
    setIsDialogOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData(course);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingCourse) {
        await updateMutation.mutateAsync(formData);
        toast.success('Course updated successfully');
      } else {
        await saveMutation.mutateAsync(formData);
        toast.success('Course created successfully');
      }
      setIsDialogOpen(false);
      setFormData({ id: '', title: '', description: '', status: ContentStatus.draft });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
      console.error(error);
    }
  };

  const handleStatusChange = async (courseId: string, status: ContentStatus) => {
    try {
      await setStatusMutation.mutateAsync({ contentId: courseId, status, isCourse: true });
      toast.success('Course status updated');
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Manage Courses</h1>
          <p className="text-xl text-muted-foreground">Create and edit training courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Course ID *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., nsw-accident-management"
                  disabled={!!editingCourse}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course description"
                  rows={4}
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
                  {saveMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : !courses || courses.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No courses yet. Create your first course to get started.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={course.status === ContentStatus.published ? 'default' : 'outline'}>{course.status}</Badge>
                      <Badge variant="outline">ID: {course.id}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Select
                    value={course.status}
                    onValueChange={(value) => handleStatusChange(course.id, value as ContentStatus)}
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
          ))}
        </div>
      )}
    </div>
  );
}
