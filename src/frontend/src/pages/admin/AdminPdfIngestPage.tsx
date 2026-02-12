import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileUp, Upload } from 'lucide-react';
import { useImportPdf } from '../../hooks/useAdmin';
import { toast } from 'sonner';

export default function AdminPdfIngestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const importPdfMutation = useImportPdf();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info('PDF selected. You can now upload it or paste extracted text below.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      await importPdfMutation.mutateAsync(uint8Array);
      toast.success('PDF imported successfully! A draft course and lesson have been created.');
      setSelectedFile(null);
      setExtractedText('');
    } catch (error) {
      toast.error('Failed to import PDF');
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

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PDF Import</h1>
          <p className="text-xl text-muted-foreground">
            Upload PDF documents to create structured training content
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF File</CardTitle>
              <CardDescription>
                Select a PDF file to import. The system will store it and create a draft course and lesson.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="text-sm text-muted-foreground mb-2">
                    {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <Button onClick={handleUpload} disabled={importPdfMutation.isPending} className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  {importPdfMutation.isPending ? 'Uploading...' : 'Upload PDF'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Text (Optional)</CardTitle>
              <CardDescription>
                If you've extracted text from the PDF externally, you can paste it here for reference when creating
                lessons and articles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Paste extracted PDF text here..."
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Note: This text is for your reference. Use the Lessons and Courses management pages to create
                structured content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
