import { User } from "@/types";
import { useGetIdentity } from "@refinedev/core";
import AdminDashboard from "./Dashboards/AdminDashboard";
import TeacherDashboard from "./Dashboards/TeacherDashboard";
import StudentDashboard from "./Dashboards/StudentDashboard";

const Dashboard = () => {
  const { data: user } = useGetIdentity<User>();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <main>
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : user.role === "teacher" ? (
        <TeacherDashboard />
      ) : (
        <StudentDashboard />
      )}
    </main>
  );
};

export default Dashboard;
