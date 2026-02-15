import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import LoginButton from './LoginButton';

interface AdminGateProps {
  children: React.ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, error: adminCheckError } = useIsCallerAdmin();

  // Show loading only while initializing identity
  if (isInitializing) {
    return (
      <div className="container px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // If not authenticated, show login UI immediately (no loading spinner)
  if (!identity) {
    return (
      <div className="container px-4 py-8 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please login to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking admin status (only after authentication)
  if (isCheckingAdmin) {
    return (
      <div className="container px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Handle admin check errors
  if (adminCheckError) {
    return (
      <div className="container px-4 py-8 max-w-md mx-auto">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Failed to verify admin status. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="container px-4 py-8 max-w-md mx-auto">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Access Denied. You do not have administrator privileges to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}
