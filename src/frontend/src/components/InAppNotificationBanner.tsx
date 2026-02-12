import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';

interface InAppNotificationBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function InAppNotificationBanner({
  message,
  onDismiss,
}: InAppNotificationBannerProps) {
  return (
    <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-green-800 dark:text-green-200 font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
