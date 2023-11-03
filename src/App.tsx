import "./App.css";
import React, { useRef } from "react";
import Magnifier from "./components/Magnifier";

import { Signal, signal } from "@preact/signals-react";
const coordinates: Signal<Coordinates> = signal({ x: 0, y: 0 });
const magnifierState = signal({ used: true, visible: true, aim: false });

function App() {
  const img: React.RefObject<HTMLImageElement> = useRef(null);

  const magnifierDiameter =
    screen.width < screen.height ? screen.width * 0.45 : screen.height * 0.45;

  const lastTouch = useRef<{
    event?: React.TouchEvent<HTMLImageElement>;
    wasMoved?: boolean;
    coordinates?: Coordinates;
  }>({});

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
    };
  }
  function onMouseLeave() {
    magnifierState.value.visible = false;
  }

  function inRadius(e: React.TouchEvent<HTMLImageElement> | undefined) {
    if (!e) return false;
    const inRadiusX =
      e.touches[0].pageX < coordinates.value.x + magnifierDiameter / 2 &&
      e.touches[0].pageX > coordinates.value.x - magnifierDiameter / 2;
    const inRadiusY =
      e.touches[0].pageY < coordinates.value.y + magnifierDiameter / 2 &&
      e.touches[0].pageY > coordinates.value.y - magnifierDiameter / 2;
    if (inRadiusX && inRadiusY) {
      return true;
    }
  }
  function getCoordinatesTouch(
    e: React.TouchEvent<HTMLImageElement>
  ): Coordinates {
    // image position relative to the viewport
    const { left, top, width, height } = (
      img.current as HTMLImageElement
    ).getBoundingClientRect();

    // image position relative to the document
    const imageLeft = left + window.scrollX;
    const imageTop = top + window.scrollY;

    // cursor position relative to the document
    const { pageX, pageY } = e.touches[0];
    let x, y;
    // check if magnifier was used
    if (magnifierState.value.used) {
      x = pageX - imageLeft - magnifierDiameter / 2;
      y = pageY - imageTop - magnifierDiameter / 2;
    } else {
      x = pageX - imageLeft;
      y = pageY - imageTop;
    }

    // cursor position relative to the image
    const imageX = Math.round((x / width) * 100);
    const imageY = Math.round((y / height) * 100);
    return {
      imageX,
      imageY,
      x,
      y,
      height,
      width,
    };
  }
  function setCoordinatesTouch(e: React.TouchEvent<HTMLImageElement>) {
    // save the event
    lastTouch.current.event = e;
    // move the magnifier if not in radius
    if (!inRadius(e)) {
      // save coordinates
      lastTouch.current.coordinates = getCoordinatesTouch(e);

      coordinates.value = lastTouch.current.coordinates;
    }
  }
  function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    magnifierState.value.aim = true;
    lastTouch.current.wasMoved = false;
    setCoordinatesTouch(e);
  }

  function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    lastTouch.current.wasMoved = true;
    setCoordinatesTouch(e);
  }
  function onTouchEnd() {
    if (lastTouch.current) {
      // if last touch was in radius
      if (inRadius(lastTouch.current.event) || !magnifierState.value.used) {
        // And was not moved(a tap)
        if (!lastTouch.current.wasMoved) {
          alert(JSON.stringify(lastTouch.current.coordinates));
        }
      } // if last touch was not in radius or was moved
      else if (lastTouch.current.coordinates) {
        coordinates.value = lastTouch.current.coordinates;
      }
    }
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
          width: coordinates.value.width,
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
        />
        <Magnifier
          src={"./wheres-vader.jpg"}
          magnifierDiameter={magnifierDiameter}
          coordinates={coordinates}
          magnifierState={magnifierState}
        />
      </div>
    </>
  );
}

export default App;
