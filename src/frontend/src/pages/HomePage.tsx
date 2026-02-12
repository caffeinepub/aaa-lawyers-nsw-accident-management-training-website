import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Shield, FileText, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/40">
        <div className="container py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                NSW Accident Management Training
              </h1>
              <p className="text-xl text-muted-foreground">
                Professional training and comprehensive knowledge resources for accident management systems, insurance
                recovery processes, and dealing with insurers in New South Wales, Australia.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" className="gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Start Training
                  </Button>
                </Link>
                <Link to="/knowledge-base">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="h-5 w-5" />
                    Browse Knowledge Base
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/nsw-training-hero.dim_1600x600.png"
                alt="NSW Training"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Learn</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive training covering all aspects of accident management and insurance recovery in NSW
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Accident Management Systems</CardTitle>
              <CardDescription>
                Master the complete accident management framework used in NSW, including documentation, reporting, and
                compliance requirements.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Recovery from At-Fault Insurers</CardTitle>
              <CardDescription>
                Learn the step-by-step process for recovering costs from at-fault insurers, including claim
                preparation, negotiation strategies, and legal frameworks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Dealing with Insurance Companies</CardTitle>
              <CardDescription>
                Develop expertise in communicating and negotiating with insurance companies, understanding their
                processes, and protecting client interests.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Two Ways to Learn</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose the learning path that works best for you. Access structured courses or browse our comprehensive
                knowledge base.
              </p>
            </div>
            <div className="grid gap-6">
              <Link to="/courses">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-6 w-6 text-primary" />
                          Training Courses
                        </CardTitle>
                        <CardDescription>
                          Structured learning paths with lessons, progress tracking, and knowledge assessments
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/knowledge-base">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-6 w-6 text-primary" />
                          Knowledge Base
                        </CardTitle>
                        <CardDescription>
                          Browse articles and resources organized by topic for quick reference and research
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
