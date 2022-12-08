import { useEffect, useRef } from "react";
import { ExportAction } from "../pages";
import { Exif } from "../utils/exif";

type Props = {
  width: number;
  height: number;
  exif: Exif;
  dispatch: React.Dispatch<ExportAction>;
};

export function CanvasExif({ width, height, exif, dispatch }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx!.font = "40px/1 Mono";
      ctx!.textBaseline = "top";
      ctx!.fillText(text, x, y);
    }

    function renderValue(
      text: string,
      x: number,
      y: number,
      style: "normal" | "italic" | "mono" = "normal"
    ) {
      const fonts = {
        normal: "bold 80px/1 Text",
        italic: "italic bold 80px/1 Text",
        mono: "normal 60px/1 Mono",
      };

      ctx!.fillStyle = "#FFFFFF";
      ctx!.font = fonts[style];
      ctx!.textBaseline = "top";
      ctx!.fillText(text, x, y);
    }

    const spacingLeft = 80;
    const dateLabelY = 300;
    const exifLabelY = 540;
    const valueLineY = (labelY: number, lineNumber: number) =>
      labelY + 70 + lineNumber * 112;

    renderLabel("DATE", spacingLeft, dateLabelY);
    renderValue(exif.captureDate, spacingLeft, valueLineY(dateLabelY, 0));

    renderLabel("EXIF", spacingLeft, exifLabelY);
    renderValue(exif.focal, spacingLeft, valueLineY(exifLabelY, 0));
    renderValue(exif.aperture, spacingLeft, valueLineY(exifLabelY, 1));
    renderValue(exif.exposure, spacingLeft, valueLineY(exifLabelY, 2));
    renderValue(exif.iso, spacingLeft, valueLineY(exifLabelY, 3));
    renderValue(exif.camera, spacingLeft, valueLineY(exifLabelY, 4));
    renderValue(exif.lens, spacingLeft, valueLineY(exifLabelY, 5));

    dispatch({
      type: "setUrl",
      name: "exif",
      url: canvasRef!.current!.toDataURL(),
    });
  }, [width, height, exif, canvasRef, dispatch]);

  return <canvas ref={canvasRef} />;
}
