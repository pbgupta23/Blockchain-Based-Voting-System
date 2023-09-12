import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";
import { Button } from "antd";

const Result = (props: any) => {
  const [loading, setLoading] = useState(false);
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

  const resetElection = () => {
    setLoading(true);
    axios
      .post("/polls/reset")
      .then((_) => {
        axios
          .get("/polls/status")
          .then((res) => {
            props.setStatus(res.data.status);
          })
          .catch((error) => console.log({ error }));
      })
      .catch((err) => console.log({ err }))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Panel name={data.name} description={data.description}>
      <>
        <Chart votes={data.votes} votedata={data.votedata} />

        <Button
          onClick={resetElection}
          loading={loading}
          className="end-election-button button-primary"
        >
          Reset Election
        </Button>
      </>
    </Panel>
  );
};

export default Result;
