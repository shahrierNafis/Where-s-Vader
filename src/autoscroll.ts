import { coordinates } from "./Types/Coordinates";

const edge =
  screen.width < screen.height ? screen.width * 0.25 : screen.height * 0.25;
export async function autoScroll() {
  const viewportY = () => {
    return coordinates.value.clientY == undefined
      ? window.innerHeight / 2
      : coordinates.value.clientY;
  };
  console.log(viewportY());

  const isInTopEdge = () => viewportY() < edge;
  const isInBottomEdge = () => viewportY() > window.innerHeight - edge;

  const maxScrollY = document.documentElement.scrollHeight - innerHeight;

  while (isInTopEdge() || isInBottomEdge()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await adjustWindowScroll();
  }
  async function adjustWindowScroll() {
    // Get the current scroll position of the document.
    const currentScrollY = scrollY;

    // Determine if the window can be scrolled in any particular direction.
    const canScrollUp = currentScrollY > 0;
    const canScrollDown = currentScrollY < maxScrollY;

    // Since we can potentially scroll in two directions at the same time,
    // let's keep track of the next scroll, starting with the current scroll.
    // Each of these values can then be adjusted independently in the logic
    // below.
    let nextScrollY = currentScrollY;

    // As we examine the mouse position within the edge, we want to make the
    // incremental scroll changes more "intense" the closer that the user
    // gets the viewport edge. As such, we'll calculate the percentage that
    // the user has made it "through the edge" when calculating the delta.
    // Then, that use that percentage to back-off from the "max" step value.
    const maxStep = 50;

    // Should we scroll up?
    if (isInTopEdge() && canScrollUp) {
      nextScrollY = nextScrollY - maxStep;
      console.log("Should go up");

      // Should we scroll down?
    } else if (isInBottomEdge() && canScrollDown) {
      nextScrollY = nextScrollY + maxStep;
      console.log("Should go down");
    }

    // Sanitize invalid maximums. An invalid scroll offset won't break the
    // subsequent .scrollTo() call; however, it will make it harder to
    // determine if the .scrollTo() method should have been called in the
    // first place.
    nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.scrollTo(scrollX, nextScrollY);
    if (currentScrollY !== nextScrollY) {
      console.log("gone", Date.now(), nextScrollY, currentScrollY);
    }
  }
}
