import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import { useEffect } from 'react';

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOrderRoute = location.pathname.startsWith('/order/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/dzeta-logo.dim_512x512.png"
              alt="D'ZETA"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="font-bold text-lg leading-none text-foreground">D'ZETA</span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">Digital Ecosystem</span>
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {!isAdminRoute && !isOrderRoute && <BottomNav />}

      <footer className="border-t bg-muted/30 py-6 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} D'ZETA Digital Ecosystem. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
