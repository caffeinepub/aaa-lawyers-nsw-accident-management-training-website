import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import KnowledgeBaseIndexPage from './pages/knowledge-base/KnowledgeBaseIndexPage';
import ArticleDetailPage from './pages/knowledge-base/ArticleDetailPage';
import CoursesIndexPage from './pages/courses/CoursesIndexPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import LessonPage from './pages/courses/LessonPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPdfIngestPage from './pages/admin/AdminPdfIngestPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminLessonsPage from './pages/admin/AdminLessonsPage';
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import { Toaster } from './components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const knowledgeBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/knowledge-base',
  component: KnowledgeBaseIndexPage,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/knowledge-base/$articleId',
  component: ArticleDetailPage,
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesIndexPage,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});

const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId/lesson/$lessonId',
  component: LessonPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminPdfIngestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/pdf-ingest',
  component: () => (
    <AdminRouteGuard>
      <AdminPdfIngestPage />
    </AdminRouteGuard>
  ),
});

const adminCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/courses',
  component: () => (
    <AdminRouteGuard>
      <AdminCoursesPage />
    </AdminRouteGuard>
  ),
});

const adminLessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/lessons',
  component: () => (
    <AdminRouteGuard>
      <AdminLessonsPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  knowledgeBaseRoute,
  articleRoute,
  coursesRoute,
  courseDetailRoute,
  lessonRoute,
  aboutRoute,
  contactRoute,
  adminDashboardRoute,
  adminPdfIngestRoute,
  adminCoursesRoute,
  adminLessonsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
