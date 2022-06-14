import Head from "../components/Head";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/useAuth";

const Dashboard = (props: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Head title={props.title} description={props.description} />
        <Navbar />
        <div className="flex min-h-screen drawer drawer-mobile">
          <input id="sidebar" type="checkbox" className="drawer-toggle" />
          <div className="drawer-side">
            <label htmlFor="sidebar" className="drawer-overlay"></label>
            <Sidebar />
          </div>
          <div className="px-4 pt-20 w-full">{props.children}</div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Dashboard;
