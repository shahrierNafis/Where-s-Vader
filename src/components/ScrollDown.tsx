import { effect, signal } from "@preact/signals-react";
import { useEffect } from "react";
import { coordinates } from "../Signals/Coordinates";
const visible = signal(false);
function ScrollDown() {
  function updateVisibility() {
    const img = document.querySelector("#img");
    if (img) {
      visible.value =
        img.getBoundingClientRect().bottom > window.innerHeight + 1;
    }
  }
  effect(() => {
    // Update visibility when image is loaded
    if (coordinates.value.height) updateVisibility();
  });
  useEffect(() => {
    window.addEventListener("scroll", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  });
  useEffect(() => {
    updateVisibility();
  });
  function onClick() {
    scrollTo({ top: scrollY + window.innerHeight * 0.5, behavior: "smooth" });
  }
  return (
    <>
      {visible.value && (
        <div
          style={{
            top: "90vh",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%, 0)",
            height: "2rem",
            background: "rgba(255, 255, 255, .5)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
          onClick={onClick}
        >
          <img src="./down-arrow.svg" alt="" style={{ height: "100%" }} />
        </div>
      )}
    </>
  );
}

export default ScrollDown;
