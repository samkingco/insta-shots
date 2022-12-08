import { css, Global } from "@emotion/core";

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        @font-face {
          font-family: "Text";
          src: url("/fonts/Text.woff2") format("woff2");
          font-style: normal;
          font-weight: normal;
        }

        @font-face {
          font-family: "Text";
          src: url("/fonts/TextBold.woff2") format("woff2");
          font-style: normal;
          font-weight: bold;
        }

        @font-face {
          font-family: "Text";
          src: url("/fonts/TextBoldItalic.woff2") format("woff2");
          font-style: italic;
          font-weight: bold;
        }

        @font-face {
          font-family: "Mono";
          src: url("/fonts/Mono.woff2") format("woff2");
          font-style: normal;
          font-weight: normal;
        }

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
          touch-action: manipulation;
        }

        .mono {
          font-family: "Mono", monospace;
          font-size: 13px;
          text-transform: uppercase;
        }
      `}
    />
  );
}
