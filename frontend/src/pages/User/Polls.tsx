import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Finished from "../../components/Polls/Finished";
import Panel from "../../components/Polls/Panel";
import Running from "../../components/Polls/Running";
import Waiting from "../../components/Waiting";
import { AuthContext } from "../../contexts/Auth";

const User = () => {
  const [voteState, setVoteStatus] = useState<
    "finished" | "running" | "not-started" | "checking"
  >("checking");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    description: "",
    votes: [],
    votedata: {},
  });

  const [votable, setVotable] = useState("");

  const [votedTo, setVotedTo] = useState<any>({ votedTo: "", voted: false });

  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log("called here ?");

    axios
      .get("/polls/status")
      .then((res) => {
        setVoteStatus(res.data.status);
        setLoading(false);
      })
      .catch((error) => console.log({ error }));
  }, []);

  useEffect(() => {
    if (voteState !== "checking") {
      axios.get("/polls/").then((res) => {
        setData(res.data);
        console.log(res.data);
        setLoading(false);
      });

      axios
        .post("/polls/votedTo", {
          id: authContext.id.toString(),
        })
        .then((res) => {
          setVotedTo(res.data.votes);
          console.log(res.data.votes);
        })
        .catch((error) => console.log({ error }));

      axios
        .post("/polls/check-voteability", {
          id: authContext.id.toString(),
        })
        .then((res) => {
          setVotable(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [voteState]);

  if (loading || voteState === "checking") return <div></div>;

  if (voteState === "not-started") return <Waiting />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", right: "30px", top: "0px" }}>
        {votedTo.voted === true ? (
          <div
            style={{
              width: "100%",
              padding: "10px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            You have Voted To : {votedTo.votedTo}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              padding: "10px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ margin: "20px" }}>You have not Voted.</div>
            {voteState !== "running" || <div>Please Vote.</div>}
          </div>
        )}
      </div>
      <Panel name={data.name} description={data.description}>
        <>
          {voteState === "running" ? <Running /> : <Finished />}

          <Chart
            enableVote={votable === "not-voted"}
            userId={authContext.id}
            userName={authContext.name}
            votes={data.votes}
            votedata={data.votedata}
          />
        </>
      </Panel>
    </div>
  );
};

export default User;
