import { format } from "date-fns";
import exifr from "exifr";

const CAMERA_MAKE_MAP: Record<any, string> = {
  FUJIFILM: "Fujifilm",
  "RICOH IMAGING COMPANY, LTD.": "Ricoh",
};

const CAMERA_MODEL_MAP: Record<any, string> = {
  "ILCE-7": "A7",
  "RICOH GR III": "GR III",
};

const LENS_MAP: Record<any, string> = {
  "GF32-64mmF4 R LM WR": "GF 32-64mm ƒ4",
};

export type Exif = {
  focal: string;
  aperture: string;
  exposure: string;
  iso: string;
  camera: string;
  lens?: string;
  captureDate: string;
};

export async function getExifFromFile(file: File): Promise<Exif | null> {
  const arrayBuffer = await new Response(file).arrayBuffer();

  const exif = await exifr.parse(arrayBuffer, { iptc: true });
  const exposure = `1/${Math.floor(1 / exif.ExposureTime)}s`;
  const aperture = `ƒ/${exif.FNumber}`;
  const iso = `ISO ${exif.ISO}`;
  const focal = `${exif.FocalLengthIn35mmFormat || exif.FocalLength}mm`;

  const camera = `${CAMERA_MAKE_MAP[exif.Make] || exif.Make} ${
    CAMERA_MODEL_MAP[exif.Model] || exif.Model
  }`;
  const lens = exif.LensModel
    ? `${CAMERA_MAKE_MAP[exif.LensMake] || exif.LensMake} ${
        LENS_MAP[exif.LensModel] || exif.LensModel
      }`
    : undefined;

  const captureDate = format(new Date(exif.CreateDate), "yyyy-MM-dd");

  return {
    focal,
    aperture,
    exposure,
    iso,
    camera,
    lens,
    captureDate,
  };
}
