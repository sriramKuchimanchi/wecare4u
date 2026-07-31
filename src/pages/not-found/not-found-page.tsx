import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from '@/config/icons';
import { APP_NAME } from '@/constants';

export const NotFoundPage = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
    <div className="flex flex-col gap-2">
      <p className="text-6xl font-bold text-primary md:text-8xl">404</p>
      <h1 className="text-xl font-semibold text-foreground md:text-2xl">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back to {APP_NAME}.
      </p>
    </div>
    <Button asChild>
      <Link to="/">
        <Home className="mr-2 h-4 w-4" /> Back to home
      </Link>
    </Button>
  </div>
);

export default NotFoundPage;
