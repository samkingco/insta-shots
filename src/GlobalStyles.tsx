import React from "react";
import { Global, css } from "@emotion/core";

export const GlobalStyles: React.FC = () => {
  return (
    <Global
      styles={css`
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          font-family: "Text", system, -apple-system, "Helvetica Neue",
            Helvetica, "Segoe UI", "Roboto", sans-serif;
        }

        body {
          background: #808080;
          color: #a3a3a3;
          text-rendering: geometricPrecision;
        }
      `}
    />
  );
};
