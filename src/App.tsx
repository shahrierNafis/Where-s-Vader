import "./App.css";
import React, { useRef } from "react";
import Magnifier from "./components/Magnifier";
import { signal } from "@preact/signals-react";
import { coordinates } from "./Types/Coordinates";
import touchHandlers from "./touchHandlers";
import ScrollDown from "./components/ScrollDown";
import ScrollUp from "./components/ScrollUp";
const magnifierState = signal({ used: true, visible: true, aim: false });
const magnifierDiameter =
  screen.width < screen.height ? screen.width * 0.45 : screen.height * 0.45;

function App() {
  const img: React.RefObject<HTMLImageElement> = useRef(null);
  function onClick() {
    // do nothing if aim is  on
    if (magnifierState.value.aim) {
      return;
    } else {
      alert(JSON.stringify(coordinates.value));
    }
  }

  function onMouseEnter() {
    magnifierState.value.visible = true;
  }

  function onMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    // do nothing if aim is on
    if (magnifierState.value.aim) return;

    // image position relative to the viewport
    const { left, top, width, height } = (
      img.current as HTMLImageElement
    ).getBoundingClientRect();

    // image position relative to the document
    const imageLeft = left + window.scrollX;
    const imageTop = top + window.scrollY;

    // cursor position relative to the document
    const { pageX, pageY } = e;
    const x = pageX - imageLeft;
    const y = pageY - imageTop;
    // cursor position relative to the image
    const imageX = Math.round(((pageX - imageLeft) / width) * 100);
    const imageY = Math.round(((pageY - imageTop) / height) * 100);
    coordinates.value = {
      imageX,
      imageY,
      x,
      y,
      height,
      width,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }
  function onMouseLeave() {
    magnifierState.value.visible = false;
  }

  function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    touchHandlers.onTouchStart(e, magnifierState);
  }

  function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    touchHandlers.onTouchMove(e, magnifierState);
  }
  function onTouchEnd() {
    touchHandlers.onTouchEnd(magnifierState);
  }
  function toggleMagnifier() {
    magnifierState.value.used = !magnifierState.value.used;
  }
  return (
    <>
      <button onClick={toggleMagnifier}>magnifier</button>
      <div
        style={{
          position: "relative",
          height: coordinates.value.height,
          width: "100vw",
        }}
      >
        <img
          src="./wheres-vader.jpg"
          ref={img}
          alt=""
          className="vw-100"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: "none" }}
        />
        <Magnifier
          src={"./wheres-vader.jpg"}
          magnifierDiameter={magnifierDiameter}
          magnifierState={magnifierState}
        />
      </div>
      <ScrollUp></ScrollUp>
      <ScrollDown></ScrollDown>
    </>
  );
}

export default App;
