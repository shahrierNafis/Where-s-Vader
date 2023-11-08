import React from "react";
import Magnifier from "./Magnifier";
import { coordinates } from "../Signals/Coordinates";
import mouseHandler from "../mouseHandleer";
import touchHandlers from "../touchHandlers";
import { magnifierState, magnifierDiameter } from "../Signals/magnifierState";
import { dropDownState } from "../Signals/DropDownState";

function Image() {
  function onClick() {
    // do nothing if aim is  on
    if (magnifierState.value.aim) {
      return;
    } else {
      dropDownState.value = { visible: true };
      // alert(JSON.stringify(coordinates.value));
    }
  }

  function onMouseEnter() {
    magnifierState.value.visible = true;
  }

  function onMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    mouseHandler.onMouseMove(e);
    dropDownState.value.visible = false;
  }
  function onMouseLeave() {
    // do nothing if aim is  on
    if (magnifierState.value.aim) {
      return;
    }
    magnifierState.value.visible = false;
  }

  function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    touchHandlers.onTouchStart(e);
  }

  function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    touchHandlers.onTouchMove(e);
  }
  function onTouchEnd(e: React.TouchEvent<HTMLImageElement>) {
    touchHandlers.onTouchEnd(e);
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          height: coordinates.value.height,
        }}
      >
        <img
          id="img"
          src="./wheres-vader.jpg"
          alt=""
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
        />
      </div>
    </>
  );
}

export default Image;
