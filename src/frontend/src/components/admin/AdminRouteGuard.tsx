import { useIsCallerAdmin } from '../../hooks/useAdmin';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { data: isAdmin, isLoading, error } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access this area. Administrator privileges are required.
          </AlertDescription>
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
