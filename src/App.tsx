import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { DeleteConfirmationProvider } from "./hooks/use-delete-confirmation";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import Dashboard from "./pages/Dashboard";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Home,
  Users,
  PlayCircle,
} from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/List";
import SubjectsCreate from "./pages/subjects/Create";
import ClassesList from "./pages/classes/List";
import ClassesCreate from "./pages/classes/Create";
import ClassesShow from "./pages/classes/show";
import DepartmentsList from "./pages/departments/List";

import SubjectsShow from "./pages/subjects/show";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsShow from "./pages/departments/show";
import FacultyList from "./pages/faculty/List";
import FacultyShow from "./pages/faculty/Show";
import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsConfirm from "./pages/enrollments/confirm";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentsList from "./pages/enrollments/list";
import LecturesList from "./pages/lectures/List";
import LecturesShow from "./pages/lectures/Show";
import LecturesCreate from "./pages/lectures/Create";
import LecturesManageContent from "./pages/lectures/ManageContent";
import LecturesDocumentView from "./pages/lectures/DocumentView";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DeleteConfirmationProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                authProvider={authProvider}
                notificationProvider={useNotificationProvider()}
                routerProvider={routerProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "ZIOnFM-Redw05-HSjbee",
                }}
                resources={[
                  {
                    name: "dashboard",
                    list: "/dashboard",
                    meta: { label: "Dashboard", icon: <Home /> },
                  },
                  {
                    name: "subjects",
                    list: "/dashboard/subjects",
                    create: "/dashboard/subjects/create",
                    show: "/dashboard/subjects/show/:id",
                    meta: { label: "Subjects", icon: <BookOpen /> },
                  },
                  {
                    name: "classes",
                    list: "/dashboard/classes",
                    create: "/dashboard/classes/create",
                    show: "/dashboard/classes/show/:id",
                    meta: { label: "Classes", icon: <GraduationCap /> },
                  },
                  {
                    name: "departments",
                    list: "/dashboard/departments",
                    create: "/dashboard/departments/create",
                    show: "/dashboard/departments/show/:id",
                    meta: { label: "Departments", icon: <Building2 /> },
                  },
                  {
                    name: "faculty",
                    list: "/dashboard/faculty",
                    show: "/dashboard/faculty/show/:id",
                    meta: {
                      label: "Faculty",
                      icon: <Users />,
                    },
                  },
                  {
                    name: "enrollments",
                    list: "/dashboard/enrollments",
                    create: "/dashboard/enrollments/create",
                    meta: {
                      label: "Enrollments",
                      icon: <ClipboardCheck />,
                    },
                  },
                  {
                    name: "lectures",
                    list: "/dashboard/lectures",
                    create: "/dashboard/lectures/create",
                    show: "/dashboard/lectures/show/:id",
                    meta: {
                      label: "Lectures",
                      icon: <PlayCircle />,
                    },
                  },
                ]}
              >
                <Routes>
                  {/* Public routes - redirect authenticated users away */}
                  <Route
                    element={
                      <Authenticated key="public-routes" fallback={<Outlet />}>
                        <NavigateToResource resource="dashboard" />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  {/* Allow manual redirect from login/register */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    element={
                      <Authenticated key="private-routes" fallback={<Login />}>
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/subjects">
                      <Route index element={<SubjectsList />} />
                      <Route path="create" element={<SubjectsCreate />} />
                      <Route path="show/:id" element={<SubjectsShow />} />
                    </Route>
                    <Route path="/dashboard/classes">
                      <Route index element={<ClassesList />} />
                      <Route path="create" element={<ClassesCreate />} />
                      <Route path="show/:id" element={<ClassesShow />} />
                    </Route>
                    <Route path="/dashboard/departments">
                      <Route index element={<DepartmentsList />} />
                      <Route path="create" element={<DepartmentsCreate />} />
                      <Route path="show/:id" element={<DepartmentsShow />} />
                    </Route>
                    <Route path="/dashboard/faculty">
                      <Route index element={<FacultyList />} />
                      <Route path="show/:id" element={<FacultyShow />} />
                    </Route>
                    <Route path="/dashboard/enrollments">
                      <Route index element={<EnrollmentsList />} />
                      <Route path="join" element={<EnrollmentsJoin />} />
                      <Route path="create" element={<EnrollmentsCreate />} />
                      <Route path="confirm" element={<EnrollmentsConfirm />} />
                    </Route>
                    <Route path="/dashboard/lectures">
                      <Route index element={<LecturesList />} />
                      <Route path="create" element={<LecturesCreate />} />
                      <Route path="show/:id" element={<LecturesShow />} />
                      <Route
                        path="manage-content/:id"
                        element={<LecturesManageContent />}
                      />
                      <Route
                        path="document/:id"
                        element={<LecturesDocumentView />}
                      />
                    </Route>
                  </Route>
                </Routes>
                <Toaster />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </DeleteConfirmationProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
