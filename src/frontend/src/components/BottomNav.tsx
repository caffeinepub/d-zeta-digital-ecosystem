import { useNavigate, useLocation } from '@tanstack/react-router';
import { Coffee, BookOpen, Calendar, Gift, UtensilsCrossed } from 'lucide-react';

const navItems = [
  { path: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/museum', label: 'Museum', icon: BookOpen },
  { path: '/booking', label: 'Booking', icon: Calendar },
  { path: '/loyalty', label: 'Loyalty', icon: Gift },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
