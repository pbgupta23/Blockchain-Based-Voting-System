import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";
import { Button } from "antd";

const Polls = (props: any) => {
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

  const endElection = () => {
    setLoading(true);
    axios
      .post("/polls/end")
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
        setLoading(true);
      });
  };

  return (
    <div>
      <Panel name={data.name} description={data.description}>
        <>
          <Chart votes={data.votes} votedata={data.votedata} />
          <Button
            onClick={endElection}
            loading={loading}
            className=" button-primary"
          >
            End Election
          </Button>
        </>
      </Panel>
      <div></div>
    </div>
  );
};

export default Polls;
