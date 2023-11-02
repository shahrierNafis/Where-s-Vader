import { signal } from "@preact/signals-react";
import { coordinates } from "../App";
export const showMagnifier = signal({ used: true, visible: false });

function Magnifier({
  src,
  magnifierHeight = 100,
  magnifierWidth = 100,
  zoomLevel = 1.5,
}: {
  src: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}) {
  const {
    value: { imageX, imageY, height, width, x, y },
  } = coordinates;
  // if no coordinates are set, don't show magnifier
  if (!(imageX && imageY && height && width && x && y)) return;
  return (
    <div
      style={{
        padding: "0px",
        display:
          showMagnifier.value.used && showMagnifier.value.visible
            ? "grid"
            : "none",
        gridTemplateAreas: `"a b"
        "c d"`,
        position: "absolute",
        // prevent magnifier blocks the mousemove event of img
        pointerEvents: "none",
        // set size of magnifier
        height: `${magnifierHeight}px`,
        width: `${magnifierWidth}px`,
        // move element center to cursor pos
        top: `${y - magnifierHeight / 2}px`,
        left: `${x - magnifierWidth / 2}px`,
        opacity: "1", // reduce opacity so you can verify position
        borderRadius: "100%",
        backgroundColor: "white",
        backgroundImage: `url('${src}')`,
        backgroundRepeat: "no-repeat",

        //calculate zoomed image size
        backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,

        //calculate position of zoomed image.
        backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
        backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
      }}
    >
      <div style={{ gridArea: "a", borderRight: "2px black solid" }}></div>
      <div style={{ gridArea: "b", borderBottom: "2px black solid" }}></div>
      <div style={{ gridArea: "c", borderTop: "2px black solid" }}></div>
      <div style={{ gridArea: "d", borderLeft: "2px black solid" }}></div>
    </div>
  );
}

export default Magnifier;
