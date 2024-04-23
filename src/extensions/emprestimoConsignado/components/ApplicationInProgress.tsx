import * as React from "react";

export function ApplicationInProgress(): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3
        style={{
          color: "red",
        }}
      >
        Você já possui uma solicitação em andamento
      </h3>
    </div>
  );
}
