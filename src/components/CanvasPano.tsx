import { useEffect, useRef, useState } from "react";
import { ExportAction } from "../pages";

interface DrawCoord {
  index: number;
  w: number;
  h: number;
  x: number;
  y: number;
}

interface Props {
  width: number;
  height: number;
  imageUrl?: string;
  darkMode: boolean;
  dispatch: React.Dispatch<ExportAction>;
}

interface CanvasProps extends Props {
  drawCoord: DrawCoord;
}

function Canvas({
  width,
  height,
  imageUrl,
  drawCoord,
  darkMode,
  dispatch,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    const ctx = canvasRef.current!.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.imageSmoothingEnabled = false;

    img.onload = function () {
      const canvasW = ctx.canvas.width;
      const canvasH = ctx.canvas.height;

      // Reset the canvas
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Draw the background
      ctx.fillStyle = darkMode ? "black" : "white";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw the image
      ctx.drawImage(img, drawCoord.x, drawCoord.y, drawCoord.w, drawCoord.h);

      dispatch({
        type: "setIndexedUrl",
        name: "pano",
        index: drawCoord.index,
        url: canvasRef!.current!.toDataURL(),
      });
    };

    img.src = imageUrl!;
  }, [width, height, imageUrl, drawCoord, darkMode, dispatch]);

  return <canvas ref={canvasRef} />;
}

export function CanvasPano({
  width,
  height,
  imageUrl,
  darkMode,
  dispatch,
}: Props) {
  const [drawCoords, setDrawCoords] = useState<DrawCoord[]>([]);

  useEffect(() => {
    const img = new Image();

    img.onload = function () {
      // Clear any previously drawn pano because the number
      // of canvas' could have changed
      dispatch({ type: "clearIndexed", name: "pano" });

      const canvasW = width;
      const canvasH = height;

      const canvasRatio = canvasW / canvasH;
      const imageRatio = img.width / img.height;
      const canvasCount = Math.ceil(imageRatio / canvasRatio);

      const drawImageW = Math.ceil((imageRatio / canvasRatio) * canvasW);
      const drawImageH = canvasH;

      const newDrawCoords = [...Array(canvasCount)].map((_, index) => {
        const x = (canvasW * canvasCount - drawImageW) / 2;
        const base = {
          index,
          w: drawImageW,
          h: drawImageH,
          y: 0,
        };
        if (index === 0) return { ...base, x };
        return { ...base, x: x - canvasW * index };
      });

      setDrawCoords(newDrawCoords);
    };

    img.src = imageUrl!;
  }, [width, height, imageUrl, dispatch]);

  return (
    <>
      {drawCoords.map((drawCoord, index) => {
        return (
          <Canvas
            key={index}
            width={width}
            height={height}
            imageUrl={imageUrl}
            drawCoord={drawCoord}
            darkMode={darkMode}
            dispatch={dispatch}
          />
        );
      })}
    </>
  );
}
