import { useEffect, useState } from "react";

export function Div100vh(props: any) {
  const [windowHeight, setWindowHeight] = useState(0);

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    updateWindowHeight();
    window.addEventListener("resize", updateWindowHeight);
    return () => {
      window.removeEventListener("resize", updateWindowHeight);
    };
  }, []);

  return (
    <div
      {...props}
      style={{ height: windowHeight ? `${windowHeight}px` : "100vh" }}
    />
  );
}
