import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Target, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About AAA Lawyers</h1>
          <p className="text-xl text-muted-foreground">
            Professional training and knowledge resources for accident management in NSW, Australia
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            AAA Lawyers Training Portal provides comprehensive educational resources for professionals working in
            accident management and insurance recovery in New South Wales, Australia.
          </p>
          <p>
            Our training platform is designed to help trainees develop expertise in managing accident claims, navigating
            the recovery process from at-fault insurers, and effectively dealing with insurance companies within the NSW
            regulatory framework.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Specialized training in NSW accident management systems and insurance recovery processes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide accessible, high-quality training that improves professional competency and client outcomes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Practical, structured learning combined with comprehensive reference materials for ongoing support
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Training Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Accident Management Systems (NSW)</h3>
              <p className="text-muted-foreground">
                Complete coverage of accident management frameworks, documentation requirements, and compliance
                obligations specific to New South Wales.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recovery from At-Fault Insurers</h3>
              <p className="text-muted-foreground">
                Detailed guidance on the recovery process, including claim preparation, evidence gathering, negotiation
                strategies, and legal considerations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dealing with Insurance Companies</h3>
              <p className="text-muted-foreground">
                Practical skills for effective communication with insurers, understanding their processes, and
                protecting client interests throughout the claims process.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
