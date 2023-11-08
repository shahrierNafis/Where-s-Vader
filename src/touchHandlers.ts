import { coordinates, Coordinates } from "./Signals/Coordinates";
import { magnifierState } from "./Signals/magnifierState";
import { signal } from "@preact/signals-react";
import { dropDownState } from "./Signals/DropDownState";

const magnifierDiameter =
  window.innerWidth < window.innerHeight
    ? window.innerWidth * 0.75
    : window.innerHeight * 0.45;

// helps touch end event to work
const lastTouch = signal<{
  wasMoved?: boolean;
  coordinates?: Coordinates;
}>({});
/**
 * Checks if the touch event is within the magnifier radius.
 * @param e - The touch event.
 * @returns True if the touch is within the magnifier radius, false otherwise.
 */
function inRadius(e: React.TouchEvent<HTMLImageElement> | undefined): boolean {
  // magnifier coordinate
  const { x, y } = coordinates.value;

  // If the touch event or coordinates are not available, return false
  if (!e || !x || !y) {
    return false;
  }

  // get the new touch position from the touch event
  ///////////////////////////////////////////////////////////////////////////////
  const { left, top } = (e.target as HTMLImageElement).getBoundingClientRect();
  // Get the image position relative to the document
  const imageLeft = left + window.scrollX;
  const imageTop = top + window.scrollY;
  // Get the touch position relative to the document
  const { pageX, pageY } = e.changedTouches[0];
  const x2 = pageX - imageLeft;
  const y2 = pageY - imageTop;
  ///////////////////////////////////////////////////////////////////////////////

  // Calculate the boundaries of the magnifier radius
  const inRadiusX =
    x2 < x + magnifierDiameter / 2 && x2 > x - magnifierDiameter / 2;
  const inRadiusY =
    y2 < y + magnifierDiameter / 2 && y2 > y - magnifierDiameter / 2;

  // Return true if the touch is within the magnifier radius, false otherwise
  return inRadiusX && inRadiusY;
}

/**
 * Calculates the coordinates from a touch event.
 * @param e - The touch event.
 * @param magnifierState - The state of the magnifier.
 * @returns The calculated coordinates.
 */
function calcCoordinates(e: React.TouchEvent<HTMLImageElement>): Coordinates {
  // Get the image position relative to the viewport
  const { left, top, width, height } = (
    e.target as HTMLImageElement
  ).getBoundingClientRect();

  // Get the image position relative to the document
  const imageLeft = left + window.scrollX;
  const imageTop = top + window.scrollY;

  // Get the cursor position relative to the document
  const { pageX, pageY } = e.touches[0];
  let x, y;

  // Check if the magnifier was used
  if (magnifierState?.value?.used) {
    x = pageX - imageLeft - magnifierDiameter / 2;
    y = pageY - imageTop - magnifierDiameter / 2;
  } else {
    x = pageX - imageLeft;
    y = pageY - imageTop;
  }

  // Get the cursor position relative to the image
  const imageX = Math.round((x / width) * 100);
  const imageY = Math.round((y / height) * 100);

  // Return the calculated coordinates
  return {
    imageX,
    imageY,
    x,
    y,
    height,
    width,
  };
}

/**
 * Moves the magnifier based on the touch event coordinates
 * @param oldCoordinates - The previous coordinates of the magnifier
 * @param e - The touch event that triggered the movement
 */
function moveDirectly(
  oldCoordinates: Coordinates,
  e: React.TouchEvent<HTMLImageElement>
) {
  // Get the present coordinates
  const magnifier = coordinates.value;
  // Get the new coordinates
  const newCoordinates = calcCoordinates(e);

  // Calculate the difference between the old and new coordinates to move the magnifier
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
  // Move the magnifier
  coordinates.value = { ...magnifier };
}

/**
 * Sets the coordinates to help the last event work and moves the magnifier.
 * @param e - The touch event.
 * @param magnifierState - The state of the magnifier.
 */
function setCoordinatesTouch(e: React.TouchEvent<HTMLImageElement>) {
  // If not in radius
  if (!inRadius(e)) {
    // Move the magnifier
    coordinates.value = calcCoordinates(e);
  } else {
    // If in radius but the touch is moving
    if (lastTouch.value.coordinates && lastTouch.value.wasMoved) {
      // Move the magnifier
      moveDirectly(lastTouch.value.coordinates, e);
    } // Save coordinates
    lastTouch.value.coordinates = calcCoordinates(e);
  }
}
function onTouchStart(e: React.TouchEvent<HTMLImageElement>) {
  // turn on aim
  if (!magnifierState.value.aim) {
    magnifierState.value = { ...magnifierState.value, aim: true };
  }

  // mark last touch as not moved
  lastTouch.value.wasMoved = false;
  // set coordinates
  setCoordinatesTouch(e);
}

function onTouchMove(e: React.TouchEvent<HTMLImageElement>) {
  // mark last touch as moved
  lastTouch.value.wasMoved = true;
  setCoordinatesTouch(e);
}
function onTouchEnd(e: React.TouchEvent<HTMLImageElement>) {
  if (lastTouch.value) {
    // if last touch was in radius
    if (inRadius(e) || !magnifierState.value.used) {
      // And was not moved(a tap)
      if (!lastTouch.value.wasMoved) {
        setTimeout(() => {
          dropDownState.value = { visible: true };
        }, 100);
      }
    }
  }
  lastTouch.value.coordinates = {};
}
export default { onTouchStart, onTouchMove, onTouchEnd };
