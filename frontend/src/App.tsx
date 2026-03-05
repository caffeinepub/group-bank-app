import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import AdminPanel from './pages/AdminPanel';
import MemberDetail from './pages/MemberDetail';
import HomePage from './pages/HomePage';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const memberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member/$memberId',
  component: MemberDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute, memberRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <LanguageProvider>
            <RouterProvider router={router} />
            <Toaster />
          </LanguageProvider>
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
