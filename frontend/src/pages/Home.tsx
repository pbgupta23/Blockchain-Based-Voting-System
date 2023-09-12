import React from "react";
import { RouteProps } from "react-router";
import Landing from "../components/Home/Landing";

const Home = (props: RouteProps): JSX.Element => {
  return (
    <>
      <Landing />
    </>
  );
};

export default Home;
