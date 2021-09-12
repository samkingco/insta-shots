import exif from "exif-js";

export interface Exif {
  focal: string;
  fnumber: string;
  shutter: string;
  iso: string;
  camera: string;
  captureDate: string;
}

export async function getExifFromFile(file: File): Promise<Exif | null> {
  const arrayBuffer = await new Response(file).arrayBuffer();

  const exifData = exif.readFromBinaryFile(arrayBuffer);
  console.log(exifData);

  const {
    FocalLengthIn35mmFilm,
    FNumber,
    ExposureTime,
    ISOSpeedRatings,
    Make,
    Model,
    DateTimeOriginal
  } = exifData;

  const values = [
    FocalLengthIn35mmFilm,
    FNumber,
    ExposureTime,
    ISOSpeedRatings,
    Make,
    Model,
    DateTimeOriginal
  ];

  if (values.some(i => i === undefined)) {
    return null;
  }

  const focal = `${FocalLengthIn35mmFilm}`;
  const fnumber = FNumber.toFixed(1);
  const shutter =
    ExposureTime.valueOf() > 1
      ? `${ExposureTime.valueOf()}`
      : `1/${1 / ExposureTime.valueOf()}`;
  const iso = `${ISOSpeedRatings}`;
  const camera = `${Make} ${Model === "ILCE-7" ? "A7" : Model}`;
  const [date] = DateTimeOriginal.split(" ");
  const captureDate = date.replace(/:/g, "-");

  return {
    focal,
    fnumber,
    shutter,
    iso,
    camera,
    captureDate
  };
}
