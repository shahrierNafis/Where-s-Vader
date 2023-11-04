import "./App.css";
import React, { useRef } from "react";
import Magnifier from "./components/Magnifier";
import { signal } from "@preact/signals-react";
import { coordinates, Coordinates } from "./Types/Coordinates";
const magnifierState = signal({ used: true, visible: true, aim: false });
const magnifierDiameter =
  screen.width < screen.height ? screen.width * 0.45 : screen.height * 0.45;

function App() {
  const img: React.RefObject<HTMLImageElement> = useRef(null);

  // helps touch end event to work
  const lastTouch = useRef<{
    event?: React.TouchEvent<HTMLImageElement>;
    wasMoved?: boolean;
    coordinates?: Coordinates;
    inRadiusCoordinates?: Coordinates;
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
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }
  function onMouseLeave() {
    magnifierState.value.visible = false;
  }

  function inRadius(e: React.TouchEvent<HTMLImageElement> | undefined) {
    const { x, y } = coordinates.value;
    if (!e || !x || !y) return false;
    const inRadiusX =
      e.touches[0].pageX < x + magnifierDiameter / 2 &&
      e.touches[0].pageX > x - magnifierDiameter / 2;
    const inRadiusY =
      e.touches[0].pageY < y + magnifierDiameter / 2 &&
      e.touches[0].pageY > y - magnifierDiameter / 2;
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
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
  }
  function getCoordinatesTouchInRadius(
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

    const x = pageX - imageLeft;
    const y = pageY - imageTop;

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
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
  }
  function moveInRadius(
    oldCoordinates: Coordinates,
    e: React.TouchEvent<HTMLImageElement>
  ) {
    const magnifier = coordinates.value;
    const newCoordinates = getCoordinatesTouchInRadius(e);
    if (magnifier.x && newCoordinates.x && oldCoordinates.x) {
      magnifier.x += newCoordinates.x - oldCoordinates.x;
    }
    if (magnifier.y && newCoordinates.y && oldCoordinates.y) {
      magnifier.y += newCoordinates.y - oldCoordinates.y;
    }
    if (magnifier.imageX && newCoordinates.imageX && oldCoordinates.imageX) {
      magnifier.imageX += newCoordinates.imageX - oldCoordinates.imageX;
    }
    if (magnifier.imageY && newCoordinates.imageY && oldCoordinates.imageY) {
      magnifier.imageY += newCoordinates.imageY - oldCoordinates.imageY;
    }
    // move the magnifier
    coordinates.value = { ...magnifier };
    lastTouch.current.coordinates = { ...magnifier };
  }
  function setCoordinatesTouch(e: React.TouchEvent<HTMLImageElement>) {
    // save the event
    lastTouch.current.event = e;
    // if not in radius
    if (!inRadius(e)) {
      // save coordinates
      lastTouch.current.coordinates = getCoordinatesTouch(e);
      // move the magnifier
      coordinates.value = lastTouch.current.coordinates;
    } else {
      // if in radius but the touch is moving
      if (lastTouch.current.inRadiusCoordinates && lastTouch.current.wasMoved) {
        // move the magnifier
        moveInRadius(lastTouch.current.inRadiusCoordinates, e);
      }
      // save coordinates
      lastTouch.current.inRadiusCoordinates = getCoordinatesTouchInRadius(e);
    }
  }
  function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    // turn on aim
    magnifierState.value.aim = true;
    // mark last touch as not moved
    lastTouch.current.wasMoved = false;
    // set coordinates
    setCoordinatesTouch(e);
  }

  function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    // mark last touch as moved
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
    </>
  );
}

export default App;
