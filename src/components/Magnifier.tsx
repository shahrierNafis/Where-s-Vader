function Magnifier({
  src,
  magnifierDiameter = 100,
  zoomLevel = 1.5,
  coordinates,
  magnifierState,
}: {
  src: string;
  magnifierDiameter?: number;
  zoomLevel?: number;
  coordinates: { value: Coordinates };
  magnifierState: { value: { used: boolean; visible: boolean; aim: boolean } };
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

  function onClick() {
    alert(JSON.stringify(coordinates.value));
  }
  return (
    <button
      onClick={onClick}
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
    </button>
  );
}
export default Magnifier;
