import React, { useEffect, useRef } from "react";
import { Exif } from "./utils/exif";
import { ExportAction } from "./App";

interface Props {
  width: number;
  height: number;
  exif: Exif;
  dispatch: React.Dispatch<ExportAction>;
}

export const CanvasExif: React.FC<Props> = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, exif, dispatch } = props;

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d", { alpha: false });
    if (!ctx || !canvasRef.current) return;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    const canvasW = ctx.canvas.width;
    const canvasH = ctx.canvas.height;

    // Reset the canvas
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Draw the background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasW, canvasH);

    function renderLabel(text: string, x: number, y: number) {
      ctx!.fillStyle = "#A3A3A3";
      ctx!.font = "40px/1 Text";
      ctx!.textBaseline = "top";
      ctx!.fillText(text, x, y);
    }

    function renderValue(
      text: string,
      x: number,
      y: number,
      style: "normal" | "italic" | "sup" = "normal"
    ) {
      const fonts = {
        normal: "bold 80px/1 Text",
        italic: "italic bold 80px/1 Text",
        sup: "bold 60px/1 Text"
      };

      ctx!.fillStyle = "#FFFFFF";
      ctx!.font = fonts[style];
      ctx!.textBaseline = "top";
      ctx!.fillText(text, x, y);
    }

    const spacingLeft = 80;
    const dateLabelY = 400;
    const exifLabelY = 650;
    const valueLineY = (labelY: number, lineNumber: number) =>
      labelY + 70 + lineNumber * 112;

    renderLabel("Date", spacingLeft, dateLabelY);
    renderValue(exif.captureDate, spacingLeft, valueLineY(dateLabelY, 0));

    renderLabel("Exif", spacingLeft, exifLabelY);
    renderValue(`${exif.focal}mm`, spacingLeft, valueLineY(exifLabelY, 0));
    renderValue("f", spacingLeft, valueLineY(exifLabelY, 1), "italic");
    renderValue(
      `/${exif.fnumber}`,
      spacingLeft + ctx.measureText("f").width,
      valueLineY(exifLabelY, 1)
    );
    renderValue(exif.shutter, spacingLeft, valueLineY(exifLabelY, 2));
    renderValue(
      "s",
      spacingLeft + ctx.measureText(exif.shutter).width + 5,
      valueLineY(exifLabelY, 2) - 8,
      "sup"
    );
    renderValue(`ISO ${exif.iso}`, spacingLeft, valueLineY(exifLabelY, 3));
    renderValue(exif.camera, spacingLeft, valueLineY(exifLabelY, 4));

    dispatch({
      type: "setUrl",
      name: "exif",
      url: canvasRef!.current!.toDataURL()
    });
  }, [width, height, exif, canvasRef, dispatch]);

  return <canvas ref={canvasRef} />;
};
