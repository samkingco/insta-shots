import styled from "@emotion/styled";
import React, { useEffect, useReducer } from "react";

interface ControlsState {
  drawScale: number;
  drawX: number;
  drawY: number;
  showGuides: boolean;
  darkMode: boolean;
}

const maxStateValues = {
  drawScale: 1,
  drawX: 2,
  drawY: 2,
};

const minStateValues = {
  drawScale: 0,
  drawX: 0,
  drawY: 0,
};

const toDecimal = (num: number, decimal: number) =>
  Number(num.toFixed(decimal));

export type NumberDrawValueName = "drawScale" | "drawX" | "drawY";
export type BooleanDrawValueName = "showGuides" | "darkMode";

export type ControlsAction =
  | {
      type: "incrementDrawValue";
      name: NumberDrawValueName;
      step: number;
    }
  | {
      type: "decrementDrawValue";
      name: NumberDrawValueName;
      step: number;
    }
  | {
      type: "toggleDrawValue";
      name: BooleanDrawValueName;
    }
  | {
      type: "reset";
      state: ControlsState;
    };

const controlsReducer = (state: ControlsState, action: ControlsAction) => {
  switch (action.type) {
    case "incrementDrawValue":
      return {
        ...state,
        [action.name]: toDecimal(state[action.name] + action.step, 2),
      };
    case "decrementDrawValue":
      return {
        ...state,
        [action.name]: toDecimal(state[action.name] - action.step, 2),
      };
    case "toggleDrawValue":
      return {
        ...state,
        [action.name]: !state[action.name],
      };
    case "reset":
      return action.state;
    default:
      throw new Error();
  }
};

interface Props {
  initialControlsState: ControlsState;
  scaleStep: number;
  xStep: number;
  yStep: number;
  onChange: (state: ControlsState) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 12px;
  grid-template-rows: repeat(2, 1fr);
  padding: 8px;
  margin: 0 auto;
  background: #000000;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  > *:last-child {
    margin-left: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`;

const FileButton = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;

  label {
    width: 100%;
    display: inline-flex;
    gap: 4px;
    padding: 8px;
    border-radius: 2px;
    background: #ffffff;
    color: #292929;
    font-size: 16px;
    font-family: "Material Icons";
    text-align: center;
  }

  input[type="file"] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
`;

const Button = styled.button`
  width: auto;
  padding: 8px;
  border: none;
  border-radius: 2px;
  background: #ffffff;
  color: #292929;
  font-family: inherit;
  font-size: 16px;
  line-height: normal;
  outline: none;

  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;

  &:disabled {
    color: #808080;
    background: #5c5c5c;
  }
`;

const IconButton = styled(Button)`
  font-family: "Material Icons";
`;

export function Controls({
  scaleStep,
  xStep,
  yStep,
  onChange,
  onFileChange,
  initialControlsState,
}: Props) {
  const [state, dispatch] = useReducer(controlsReducer, initialControlsState);

  const incrementDrawValue = (name: NumberDrawValueName, step: number) => {
    dispatch({ type: "incrementDrawValue", name, step });
  };

  const decrementDrawValue = (name: NumberDrawValueName, step: number) => {
    dispatch({ type: "decrementDrawValue", name, step });
  };

  const toggleDrawValue = (name: BooleanDrawValueName) => {
    dispatch({ type: "toggleDrawValue", name });
  };

  const reset = () => {
    dispatch({ type: "reset", state: initialControlsState });
  };

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <Wrapper>
      <Row>
        <ButtonGroup>
          <FileButton>
            <label htmlFor="imageInput">
              attach_file <span className="mono">Upload</span>
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={onFileChange}
            />
          </FileButton>
        </ButtonGroup>

        <ButtonGroup>
          <IconButton onClick={() => toggleDrawValue("showGuides")}>
            straighten
          </IconButton>

          <IconButton onClick={() => toggleDrawValue("darkMode")}>
            {state.darkMode ? "light_mode" : "dark_mode"}
          </IconButton>
        </ButtonGroup>
      </Row>

      <Row>
        <ButtonGroup>
          <IconButton
            onClick={() => decrementDrawValue("drawScale", scaleStep)}
            disabled={state.drawScale <= minStateValues.drawScale}
          >
            remove
          </IconButton>

          <IconButton
            onClick={() => incrementDrawValue("drawScale", scaleStep)}
            disabled={state.drawScale >= maxStateValues.drawScale}
          >
            add
          </IconButton>

          <IconButton
            onClick={() => decrementDrawValue("drawY", yStep)}
            disabled={state.drawY <= minStateValues.drawY}
          >
            arrow_upward
          </IconButton>

          <IconButton
            onClick={() => incrementDrawValue("drawY", yStep)}
            disabled={state.drawY >= maxStateValues.drawY}
          >
            arrow_downward
          </IconButton>

          <IconButton
            onClick={() => decrementDrawValue("drawX", xStep)}
            disabled={state.drawX <= minStateValues.drawX}
          >
            arrow_back
          </IconButton>

          <IconButton
            onClick={() => incrementDrawValue("drawX", xStep)}
            disabled={state.drawX >= maxStateValues.drawX}
          >
            arrow_forward
          </IconButton>
        </ButtonGroup>

        <ButtonGroup>
          <IconButton onClick={reset}>refresh</IconButton>
        </ButtonGroup>
      </Row>
    </Wrapper>
  );
}
