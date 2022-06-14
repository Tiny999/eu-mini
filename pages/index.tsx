import type { NextPage } from "next";
import { useAuth } from "../contexts/useAuth";
import Dashboard from "../layouts/Dashboard";

export const Index: NextPage = () => {
  const auth = useAuth();

  return (
    <Dashboard title={"Index"} description={"Index page"}>
      <h1>Index Page</h1>

      <p>
        This is the index page of the world and it is a great place to start
      </p>
    </Dashboard>
  );
};

export default Index;
