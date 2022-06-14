import type { NextPage } from "next";
import Dashboard from "../layouts/Dashboard";

export const Home: NextPage = () => {
  return (
    <Dashboard title={"Home"} description={"Home page"}>
      <h1>Home Page</h1>

      <p>This is the fucking home page</p>
    </Dashboard>
  );
};

export default Home;
