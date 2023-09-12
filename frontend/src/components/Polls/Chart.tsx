import React, { useEffect, useState } from "react";
import axios from "../../axios";

interface ChartProps {
  votes: any;
  enableVote?: boolean;
  userId?: number;
  userName?: string;
  votedata: { [key: string]: string };
}

const Chart = (props: ChartProps) => {
  const [electionStatus, setElectionStatus] = useState<string>("");

  const votes = props.votes;
  const votedata = props.votedata;

  const getNames = () => {
    const names = [];

    const vote = (candidate: string) => {
      axios
        .post("/polls/vote", {
          id: props.userId?.toString(),
          name: props.userName,
          candidate,
        })
        .then((_) => window.location.reload())
        .catch((err) => console.log({ err }));
    };

    for (const name of votes) {
      names.push(
        <div key={name[0]} className="name-wrapper text-normal">
          {
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={`http://localhost:8000${name[2]}`}
                alt="gigi"
                width={"200px"}
                height={"200px"}
              />
              <p className="candidateName">{name[0]}</p>
              {props.enableVote ? (
                <div>
                  <button
                    onClick={() => vote(name[0])}
                    key={name}
                    className="button-wrapper "
                  >
                    vote
                  </button>
                </div>
              ) : null}
            </div>
          }
        </div>
      );
    }

    return names;
  };

  function getWinner(): string[] {
    let winners: any = [];
    let highestVotes = 0;

    for (const [candidate, votes] of Object.entries(votedata)) {
      if (parseInt(votes) > highestVotes) {
        winners = [candidate];
        highestVotes = +votes;
      } else if (+votes === highestVotes) {
        winners.push(candidate);
      }
    }

    return winners;
  }

  const getBars = () => {
    const bars = [];

    for (const name in votedata) {
      const count = votedata[name];
      bars.push(
        <tr className="tr">
          <td className="td">{name}</td>
          <td className="td">{votedata[name]}</td>
        </tr>
      );
    }

    return bars;
  };

  useEffect(() => {
    axios
      .get("/polls/status")
      .then((res) => {
        setElectionStatus(res.data.status);
        console.log(res.data.status);
      })
      .catch((error) => console.log({ error }));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div className="bars-container" style={{ marginBottom: "20px" }}>
        Candidates
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {electionStatus === "running" ? null : (
          // <div className="result-container">{getBars()}</div><div>
          <div className="result-container">
            <table className="table">
              <tr className="tr">
                <th className="th">Candidates</th>
                <th className="th">Votes</th>
              </tr>
              <tbody>{getBars()}</tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              {getWinner().length >= 2 ? (
                `Election Draws`
              ) : (
                <p>Winner is {getWinner()[0]}</p>
              )}
            </div>
          </div>
        )}

        {electionStatus === "running" && (
          <div
            className="names-wrapper"
            style={{
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              gap: "10px",
            }}
          >
            {getNames()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
