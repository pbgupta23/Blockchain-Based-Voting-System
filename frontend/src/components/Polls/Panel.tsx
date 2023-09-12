import React from "react";
import Chart from "./Chart";

interface PanelProps {
  name: string;
  description: string;
  children: JSX.Element;
}

const Panel = (props: PanelProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        padding: "20px",
        justifyContent: "center",
        marginTop:"10px",
        borderRadius:"10px"
      }}
    >
      <p className="title-small">{props.name}</p>
      <p className="text-normal">{props.description}</p>

      <div
        // className="votes-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          justifyContent: "center",
          width: "70vw",
          flexWrap: "wrap",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Panel;
