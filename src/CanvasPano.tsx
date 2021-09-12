import React, { useRef, useState, useEffect } from "react";
import { ExportAction } from "./App";

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
  dispatch: React.Dispatch<ExportAction>;
}

interface CanvasProps extends Props {
  drawCoord: DrawCoord;
}

const Canvas: React.FC<CanvasProps> = props => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, imageUrl, drawCoord, dispatch } = props;

  useEffect(() => {
    const img = new Image();
    const ctx = canvasRef.current!.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.imageSmoothingEnabled = false;

    img.onload = function() {
      const canvasW = ctx.canvas.width;
      const canvasH = ctx.canvas.height;

      // Reset the canvas
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Draw the background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw the image
      ctx.drawImage(img, drawCoord.x, drawCoord.y, drawCoord.w, drawCoord.h);

      dispatch({
        type: "setIndexedUrl",
        name: "pano",
        index: drawCoord.index,
        url: canvasRef!.current!.toDataURL()
      });
    };

    img.src = imageUrl!;
  }, [width, height, imageUrl, drawCoord, dispatch]);

  return <canvas ref={canvasRef} />;
};

export const CanvasPano: React.FC<Props> = props => {
  const { width, height, imageUrl, dispatch } = props;
  const [drawCoords, setDrawCoords] = useState<DrawCoord[]>([]);

  useEffect(() => {
    const img = new Image();

    img.onload = function() {
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
          y: 0
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
            dispatch={dispatch}
          />
        );
      })}
    </>
  );
};
