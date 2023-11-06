import { coordinates } from "../Signals/Coordinates";
import { magnifierState } from "../Signals/magnifierState";

function Magnifier({
  src,
  magnifierDiameter = 100,
  zoomLevel = 1.5,
}: {
  src: string;
  magnifierDiameter?: number;
  zoomLevel?: number;
}) {
  // Function Start

  // get coordinates
  const {
    value: { imageX, imageY, height, width, x, y },
  } = coordinates;
  // get magnifier state
  const {
    value: { used, visible, aim },
  } = magnifierState;
  // if coordinates are not set, don't show magnifier
  if (!(imageX && imageY && height && width && x && y)) return;

  return (
    <div
      style={{
        padding: "0px",
        display: used && visible ? "flex" : "none",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        // prevent magnifier blocks the mousemove event of img
        pointerEvents: "none",
        // set size of magnifier
        height: `${magnifierDiameter}px`,
        width: `${magnifierDiameter}px`,
        // move element center to cursor pos
        top: `${y - magnifierDiameter / 2}px`,
        left: `${x - magnifierDiameter / 2}px`,
        opacity: "1", // reduce opacity so you can verify position
        borderRadius: "100%",
        border: "1px solid black",
        backgroundColor: "white",
        backgroundImage: `url('${src}')`,
        backgroundRepeat: "no-repeat",

        //calculate zoomed image size
        backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,

        //calculate position of zoomed image.
        backgroundPositionX: `${-x * zoomLevel + magnifierDiameter / 2}px`,
        backgroundPositionY: `${-y * zoomLevel + magnifierDiameter / 2}px`,
      }}
    >
      {/* show aim */}
      {aim && <img src="./aim.svg" alt="" />}
    </div>
  );
}
Magnifier.Button = function () {
  function toggleMagnifier() {
    magnifierState.value = {
      ...magnifierState.value,
      used: !magnifierState.value.used,
    };
  }
  return (
    <>
      {magnifierState.value.used ? (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={toggleMagnifier}
        >
          magnifier: on
        </button>
      ) : (
        <button
          onClick={toggleMagnifier}
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          magnifier: off
        </button>
      )}
    </>
  );
};
export default Magnifier;
