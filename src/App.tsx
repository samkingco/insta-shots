import React, { useState, useEffect, useReducer } from "react";
import FontFaceObserver from "fontfaceobserver";
import { getExifFromFile, Exif } from "./utils/exif";
import { GlobalStyles } from "./GlobalStyles";
import { Controls } from "./Controls";
import { CanvasHero } from "./CanvasHero";
import { CanvasExif } from "./CanvasExif";
import { CanvasPano } from "./CanvasPano";
import { PostImages } from "./PostImages";
import { Div100vh } from "./Div100vh";
import styled from "@emotion/styled";

const POST_WIDTH = 1080;
const POST_HEIGHT = 1350;

interface IndexedExport {
  [key: number]: string;
}

interface ExportState {
  hero: string;
  pano: IndexedExport;
  exif: string;
}

export type ExportAction =
  | { type: "setUrl"; url: string; name: "hero" | "exif" }
  | { type: "setIndexedUrl"; url: string; index: number; name: "pano" }
  | { type: "clearIndexed"; name: "pano" };

const exportReducer = (state: ExportState, action: ExportAction) => {
  switch (action.type) {
    case "setUrl":
      return {
        ...state,
        [action.name]: action.url
      };
    case "setIndexedUrl":
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.index]: action.url
        }
      };
    case "clearIndexed":
      return {
        ...state,
        [action.name]: {}
      };
    default:
      throw new Error();
  }
};

const initialExportState = {
  hero: "",
  pano: {},
  exif: ""
};

const initialControlsState = {
  drawScale: 0.8,
  drawX: 1,
  drawY: 1,
  showGuides: false
};

const AppLayout = styled(Div100vh)`
  display: grid;
  grid-template-rows: 1fr auto;
`;

export const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [exif, setExif] = useState<Exif | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [exportState, dispatch] = useReducer(exportReducer, initialExportState);
  const [controls, setControls] = useState(initialControlsState);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    // Extract exif data
    // TODO: Handle errors
    const exifData = await getExifFromFile(file);
    setExif(exifData);

    // Get a Base64 url of the image
    const reader = new FileReader();
    reader.onload = function() {
      setImageUrl(`${reader.result}`);
    };
    reader.readAsDataURL(file);
  };

  // Make sure fonts are loaded
  useEffect(() => {
    const fontFaceObservers = [
      { name: "Text", weight: "normal" },
      { name: "Text", weight: "bold" },
      { name: "Text", weight: "bold", style: "italic" }
    ].map(({ name, ...data }) => {
      const obs = new FontFaceObserver(name, data);
      return obs.load();
    });

    Promise.all(fontFaceObservers)
      .then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(false));
  }, []);

  const postImages = [
    {
      src: exportState.hero,
      name: "Hero",
      width: POST_WIDTH,
      height: POST_HEIGHT
    },
    ...Object.keys(exportState.pano).map((index: any) => ({
      src: exportState.pano[index],
      name: `Pano ${index}`,
      width: POST_WIDTH,
      height: POST_HEIGHT
    }))
  ];

  if (exif) {
    postImages.push({
      src: exportState.exif,
      name: "Exif",
      width: POST_WIDTH,
      height: POST_HEIGHT
    });
  }

  return (
    <>
      <GlobalStyles />
      <AppLayout>
        <PostImages postImages={postImages} />

        <Controls
          initialControlsState={initialControlsState}
          scaleStep={0.05}
          xStep={0.2}
          yStep={0.1}
          onChange={setControls}
          onFileChange={onFileChange}
        />
      </AppLayout>

      <div style={{ display: "none" }}>
        <CanvasHero
          width={POST_WIDTH}
          height={POST_HEIGHT}
          imageUrl={imageUrl}
          drawScale={controls.drawScale}
          drawX={controls.drawX}
          drawY={controls.drawY}
          showGuides={controls.showGuides}
          dispatch={dispatch}
        />

        <CanvasPano
          width={POST_WIDTH}
          height={POST_HEIGHT}
          imageUrl={imageUrl}
          dispatch={dispatch}
        />

        {exif && fontsLoaded && (
          <CanvasExif
            width={POST_WIDTH}
            height={POST_HEIGHT}
            exif={exif}
            dispatch={dispatch}
          />
        )}
      </div>
    </>
  );
};
