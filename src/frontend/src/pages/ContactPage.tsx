import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with AAA Lawyers for training inquiries and support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">Contact details available upon request</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">Contact details available upon request</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">New South Wales, Australia</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Training Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For questions about training courses, technical support, or content inquiries, please reach out through
                the contact methods provided.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">Office Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM AEST</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Response Time</h3>
                <p className="text-muted-foreground">We aim to respond to all inquiries within 1-2 business days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
