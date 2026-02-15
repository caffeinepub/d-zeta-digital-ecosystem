import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, Info } from 'lucide-react';
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

  // Handle admin check errors with actionable guidance
  if (adminCheckError) {
    return (
      <div className="container px-4 py-8 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Admin Check Failed</AlertTitle>
          <AlertDescription>
            {adminCheckError instanceof Error ? adminCheckError.message : 'Unable to verify admin status. Please try again.'}
          </AlertDescription>
        </Alert>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you are the first admin setting up this application, the admin access control may need to be initialized.
            </p>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>For Developers</AlertTitle>
              <AlertDescription className="text-xs mt-2">
                The backend uses <code className="bg-muted px-1 py-0.5 rounded">secureBootAdmin</code> for initial admin setup.
                This must be called once with the first admin's Principal and an admin token.
                After initialization, admin status is managed through the access control system.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated but not admin, show clear unauthorized message
  if (isAdmin === false) {
    return (
      <div className="container px-4 py-8 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>You do not have admin privileges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This area is restricted to administrators only. If you believe you should have access, please contact the system administrator.
            </p>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your Principal: <code className="bg-muted px-1 py-0.5 rounded text-xs break-all">{identity.getPrincipal().toString()}</code>
              </AlertDescription>
            </Alert>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}
