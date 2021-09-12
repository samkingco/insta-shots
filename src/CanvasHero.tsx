import React, { useEffect, useRef } from "react";
import { ExportAction } from "./App";

interface Props {
  width: number;
  height: number;
  imageUrl?: string;
  drawScale: number;
  drawX: number;
  drawY: number;
  showGuides: boolean;
  dispatch: React.Dispatch<ExportAction>;
}

export const CanvasHero: React.FC<Props> = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    width,
    height,
    imageUrl,
    drawScale,
    drawX,
    drawY,
    showGuides,
    dispatch
  } = props;

  useEffect(() => {
    const img = new Image();

    img.onload = function() {
      const ctx = canvasRef.current!.getContext("2d");
      if (!ctx || !canvasRef.current) return;

      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.imageSmoothingEnabled = false;

      const canvasW = ctx.canvas.width;
      const canvasH = ctx.canvas.height;

      // Reset the canvas
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Draw the background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw the image
      const drawImageW = Math.ceil(drawScale * canvasW);
      const drawImageH = Math.ceil(img.height * (drawImageW / img.width));
      const drawImageX = Math.ceil(((canvasW - drawImageW) / 2) * drawX);
      const drawImageY = Math.ceil(((canvasH - drawImageH) / 2) * drawY);
      ctx.drawImage(img, drawImageX, drawImageY, drawImageW, drawImageH);

      // Draw guides
      if (showGuides) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(0, (canvasH - canvasW) / 2, canvasW, 1);
        ctx.fillRect(0, canvasW + (canvasH - canvasW) / 2, canvasW, 1);
      }

      dispatch({
        type: "setUrl",
        name: "hero",
        url: canvasRef!.current!.toDataURL()
      });
    };

    img.src = imageUrl!;
  }, [
    width,
    height,
    imageUrl,
    drawScale,
    drawX,
    drawY,
    showGuides,
    canvasRef,
    dispatch
  ]);

  return <canvas ref={canvasRef} />;
};
