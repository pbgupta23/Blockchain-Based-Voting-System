import React, { useEffect, useState } from "react";
import { RouteProps } from "react-router";
import axios from "../../axios";
import StartPage from "./Start";
import PollsPage from "./Polls";
import ResultPage from "./Result";

const Home = (props: RouteProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"not-started" | "running" | "finished">(
    "not-started"
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get("/polls/status")
      .then((res) => {
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch((error) => console.log({ error }));
  }, [status]);

  if (loading) return <div></div>;

  if (status === "finished") return <ResultPage setStatus={setStatus}/>;
  if (status === "running") return <PollsPage setStatus={setStatus}/>;

  return <StartPage setStatus={setStatus} />;
};

export default Home;
