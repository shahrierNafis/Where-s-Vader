import { coordinates, Coordinates } from "./Types/Coordinates";
const magnifierDiameter =
  screen.width < screen.height ? screen.width * 0.45 : screen.height * 0.45;

import { signal } from "@preact/signals-react";

// helps touch end event to work
const lastTouch = signal<{
  event?: React.TouchEvent<HTMLImageElement>;
  wasMoved?: boolean;
  coordinates?: Coordinates;
  inRadiusCoordinates?: Coordinates;
}>({});

/**
 * Checks if the touch event is within the magnifier radius.
 * @param e - The touch event.
 * @returns True if the touch is within the magnifier radius, false otherwise.
 */
function inRadius(e: React.TouchEvent<HTMLImageElement> | undefined): boolean {
  const { x, y } = coordinates.value;

  // If the touch event or coordinates are not available, return false
  if (!e || !x || !y) {
    return false;
  }

  // Calculate the boundaries of the magnifier radius
  const inRadiusX =
    e.touches[0].pageX < x + magnifierDiameter / 2 &&
    e.touches[0].pageX > x - magnifierDiameter / 2;
  const inRadiusY =
    e.touches[0].pageY < y + magnifierDiameter / 2 &&
    e.touches[0].pageY > y - magnifierDiameter / 2;

  // Return true if the touch is within the magnifier radius, false otherwise
  return inRadiusX && inRadiusY;
}

/**
 * Calculates the coordinates from a touch event.
 * @param e - The touch event.
 * @param magnifierState - The state of the magnifier.
 * @returns The calculated coordinates.
 */
function calcCoordinates(
  e: React.TouchEvent<HTMLImageElement>,
  magnifierState?: MagnifierState
): Coordinates {
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
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY,
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

  if (magnifier.clientX && newCoordinates.x && oldCoordinates.x) {
    magnifier.clientX += newCoordinates.x - oldCoordinates.x;
  }
  if (magnifier.clientY && newCoordinates.y && oldCoordinates.y) {
    magnifier.clientY += newCoordinates.y - oldCoordinates.y;
  }
  // Move the magnifier
  coordinates.value = { ...magnifier };
  lastTouch.value.coordinates = { ...magnifier };
}

/**
 * Sets the coordinates to help the last event work and moves the magnifier.
 * @param e - The touch event.
 * @param magnifierState - The state of the magnifier.
 */
function setCoordinatesTouch(
  e: React.TouchEvent<HTMLImageElement>,
  magnifierState: MagnifierState
) {
  // Save the event
  lastTouch.value.event = e;

  // If not in radius
  if (!inRadius(e)) {
    // Save coordinates
    lastTouch.value.coordinates = calcCoordinates(e, magnifierState);
    // Move the magnifier
    coordinates.value = lastTouch.value.coordinates;
  } else {
    // If in radius but the touch is moving
    if (lastTouch.value.inRadiusCoordinates && lastTouch.value.wasMoved) {
      // Move the magnifier
      moveDirectly(lastTouch.value.inRadiusCoordinates, e);
    }
    // Save coordinates
    lastTouch.value.inRadiusCoordinates = calcCoordinates(e);
  }
}
function onTouchStart(
  e: React.TouchEvent<HTMLImageElement>,
  magnifierState: MagnifierState
) {
  // turn on aim
  magnifierState.value.aim = true;
  // mark last touch as not moved
  lastTouch.value.wasMoved = false;
  // set coordinates
  setCoordinatesTouch(e, magnifierState);
}

function onTouchMove(
  e: React.TouchEvent<HTMLImageElement>,
  magnifierState: MagnifierState
) {
  // mark last touch as moved
  lastTouch.value.wasMoved = true;
  setCoordinatesTouch(e, magnifierState);
}
function onTouchEnd(magnifierState: MagnifierState) {
  if (lastTouch.value) {
    // if last touch was in radius
    if (inRadius(lastTouch.value.event) || !magnifierState.value.used) {
      // And was not moved(a tap)
      if (!lastTouch.value.wasMoved) {
        alert(JSON.stringify(lastTouch.value.coordinates));
      }
    }
  }
}
export default { onTouchStart, onTouchMove, onTouchEnd };
