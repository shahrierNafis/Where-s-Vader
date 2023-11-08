import { coordinates } from "./Signals/Coordinates";
import { magnifierState } from "./Signals/magnifierState";

function onMouseMove(e: React.MouseEvent<HTMLImageElement>) {
  // do nothing if aim is on
  if (magnifierState.value.aim) return;

  // image position relative to the viewport
  const { left, top, width, height } = (
    e.target as HTMLImageElement
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

  // cursor position relative to the viewport
  const { clientX, clientY } = e;

  coordinates.value = {
    imageX,
    imageY,
    x,
    y,
    height,
    width,
    clientX,
    clientY,
  };
}
export default { onMouseMove };
