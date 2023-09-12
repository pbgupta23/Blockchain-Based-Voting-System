import React, { useEffect, useState } from "react";
import axios from "../axios";
import Chart from "../components/Polls/Chart";
import Panel from "../components/Polls/Panel";

const Result = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    description: "",
    votes: [],
    votedata: {},
  });

  useEffect(() => {
    axios.get("/polls/").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div></div>;

  return (
    <Panel name={data.name} description={data.description}>
      <Chart votes={data.votes} votedata={data.votedata} />
    </Panel>
  );
};

export default Result;
