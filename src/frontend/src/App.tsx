import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import OrderStatusPage from './pages/OrderStatusPage';
import MiniMuseumPage from './pages/MiniMuseumPage';
import ArtifactDetailPage from './pages/ArtifactDetailPage';
import SpaceBookingPage from './pages/SpaceBookingPage';
import LoyaltyPage from './pages/LoyaltyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MenuPage from './pages/MenuPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const orderStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: OrderStatusPage,
});

const museumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/museum',
  component: MiniMuseumPage,
});

const artifactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/museum/artifact/$artifactId',
  component: ArtifactDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking',
  component: SpaceBookingPage,
});

const loyaltyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loyalty',
  component: LoyaltyPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  orderStatusRoute,
  museumRoute,
  artifactRoute,
  bookingRoute,
  loyaltyRoute,
  menuRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
