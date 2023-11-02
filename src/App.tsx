import "./App.css";
import React, { useRef } from "react";
import Magnifier, { showMagnifier } from "./components/Magnifier";

import { Signal, signal } from "@preact/signals-react";
export const coordinates: Signal<{
  imageX?: number;
  imageY?: number;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}> = signal({});

function App() {
  const img = useRef(null);
  function name() {
    alert(coordinates.value.imageX + " " + coordinates.value.imageY);
  }
  function onMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    const { left, top, width, height } = (
      e.target as HTMLTextAreaElement
    ).getBoundingClientRect();

    const { pageX, pageY } = e;
    // calculate cursor position on the image
    const x = pageX - left - window.pageXOffset;
    const y = pageY - top - window.pageYOffset;
    coordinates.value = {
      imageX: Math.round((pageX / width) * 100),
      imageY: Math.round((pageY / height) * 100),
      x,
      y,
      height,
      width,
    };
  }
  function onMouseEnter() {
    showMagnifier.value.visible = true;
  }
  function onMouseLeave() {
    showMagnifier.value.visible = false;
  }
  function toggleMagnifier() {
    showMagnifier.value.used = !showMagnifier.value.used;
  }
  return (
    <>
      <button onClick={toggleMagnifier}>magnifier</button>
      <div
        style={{
          position: "relative",
          height: coordinates.value.height,
          width: coordinates.value.width,
        }}
      >
        <img
          src="./wheres-vader.jpg"
          ref={img}
          alt=""
          className="vw-100"
          onClick={name}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        <Magnifier
          src={"./wheres-vader.jpg"}
          magnifierHeight={(coordinates.value.height || 5000) * 0.1}
          magnifierWidth={(coordinates.value.height || 5000) * 0.1}
        />
      </div>
    </>
  );
}

export default App;
