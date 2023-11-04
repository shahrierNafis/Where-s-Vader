import { coordinates } from "./Types/Coordinates";
const edgeSize =
  screen.width < screen.height ? screen.width * 0.25 : screen.height * 0.25;
export async function autoScroll() {
  if (!coordinates.value.clientX || !coordinates.value.clientY) return;
  const viewportX = () => coordinates.value.clientX || screen.width / 2;
  const viewportY = () => coordinates.value.clientY || screen.height / 2;

  // Get the viewport dimensions.
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  // Next, we need to determine if the mouse is within the "edge" of the
  // viewport, which may require scrolling the window. To do this, we need to
  // calculate the boundaries of the edge in the viewport (these coordinates
  // are relative to the viewport grid system).
  const edgeTop = edgeSize;
  const edgeLeft = edgeSize;
  const edgeBottom = viewportHeight - edgeSize;
  const edgeRight = viewportWidth - edgeSize;

  const isInLeftEdge = () => viewportX() < edgeLeft;
  const isInRightEdge = () => viewportX() > edgeRight;
  const isInTopEdge = () => viewportY() < edgeTop;
  const isInBottomEdge = () => viewportY() > edgeBottom;

  // If the mouse is not in the viewport edge, there's no need to calculate
  // anything else.

  // If we made it this far, the user's mouse is located within the edge of the
  // viewport. As such, we need to check to see if scrolling needs to be done.

  // Get the document dimensions.
  // --
  // NOTE: The constious property reads here are for cross-browser compatibility
  // as outlined in the JavaScript.info site (link provided above).
  const documentWidth = Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.body.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.body.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );

  // Calculate the maximum scroll offset in each direction. Since you can only
  // scroll the overflow portion of the document, the maximum represents the
  // length of the document that is NOT in the viewport.
  const maxScrollX = documentWidth - viewportWidth;
  const maxScrollY = documentHeight - viewportHeight;

  // As we examine the mousemove event, we want to adjust the window scroll in
  // immediate response to the event; but, we also want to continue adjusting
  // the window scroll if the user rests their mouse in the edge boundary. To
  // do this, we'll invoke the adjustment logic immediately. Then, we'll setup
  // a timer that continues to invoke the adjustment logic while the window can
  // still be scrolled in a particular direction.
  // --
  // NOTE: There are probably better ways to handle the ongoing animation
  // check. But, the point of this demo is really about the math logic, not so
  // much about the interval logic.

  // Adjust the window scroll based on the user's mouse position. Returns True
  // or False depending on whether or not the window scroll was changed.
  while (
    isInLeftEdge() ||
    isInRightEdge() ||
    isInTopEdge() ||
    isInBottomEdge()
  ) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    adjustWindowScroll();
  }
  function adjustWindowScroll() {
    // Get the current scroll position of the document.
    const currentScrollX = window.pageXOffset;
    const currentScrollY = window.pageYOffset;

    // Determine if the window can be scrolled in any particular direction.
    const canScrollUp = currentScrollY > 0;
    const canScrollDown = currentScrollY < maxScrollY;
    const canScrollLeft = currentScrollX > 0;
    const canScrollRight = currentScrollX < maxScrollX;

    // Since we can potentially scroll in two directions at the same time,
    // let's keep track of the next scroll, starting with the current scroll.
    // Each of these values can then be adjusted independently in the logic
    // below.
    let nextScrollX = currentScrollX;
    let nextScrollY = currentScrollY;

    // As we examine the mouse position within the edge, we want to make the
    // incremental scroll changes more "intense" the closer that the user
    // gets the viewport edge. As such, we'll calculate the percentage that
    // the user has made it "through the edge" when calculating the delta.
    // Then, that use that percentage to back-off from the "max" step value.
    const maxStep = 2;

    // Should we scroll left?
    if (isInLeftEdge() && canScrollLeft) {
      nextScrollX = nextScrollX - maxStep;

      // Should we scroll right?
    } else if (isInRightEdge() && canScrollRight) {
      nextScrollX = nextScrollX + maxStep;
    }

    // Should we scroll up?
    if (isInTopEdge() && canScrollUp) {
      nextScrollY = nextScrollY - maxStep;

      // Should we scroll down?
    } else if (isInBottomEdge() && canScrollDown) {
      nextScrollY = nextScrollY + maxStep;
    }

    // Sanitize invalid maximums. An invalid scroll offset won't break the
    // subsequent .scrollTo() call; however, it will make it harder to
    // determine if the .scrollTo() method should have been called in the
    // first place.
    nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
    nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

    if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
      window.scrollTo(nextScrollX, nextScrollY);
      return true;
    } else {
      return false;
    }
  }
}
