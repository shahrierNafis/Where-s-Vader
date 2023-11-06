import { signal } from "@preact/signals-react";
import { useEffect } from "react";
const visible = signal(false);
function ScrollUp() {
  function updateVisibility() {
    const img = document.querySelector("#img");
    if (img) {
      visible.value = img.getBoundingClientRect().top < 0;
    }
  }

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
    scrollTo({ top: scrollY - window.innerHeight * 0.5, behavior: "smooth" });
  }
  return (
    <>
      {visible.value && (
        <div
          style={{
            top: "10vh",
            position: "fixed",
            right: "50%",
            height: "2rem",
            background: "rgba(255, 255, 255, .5)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            rotate: "180deg",
            transform: "translate(-50%, 0)",
          }}
          onClick={onClick}
        >
          <img src="./down-arrow.svg" alt="" style={{ height: "100%" }} />
        </div>
      )}
    </>
  );
}

export default ScrollUp;
