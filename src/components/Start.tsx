import { signal } from "@preact/signals-react";
import background from "/background.jpg";
import server from "../server";
const FS = screen.height > screen.width ? "vw" : "vh";
const visible = signal(true);
function Start() {
  return (
    <>
      {visible.value && (
        <div
          style={{
            height: "100vh",
            width: "100$vw",
            top: 0,
            backgroundImage: `url('${background}')`,
            position: "fixed",
            zIndex: 999,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              color: "cyan",
              position: "fixed",
              top: "0",
              left: "0",
              fontSize: `10${FS}`,
            }}
          >
            press start to play...
          </h2>
          <h1
            style={{
              color: "gold",
              fontSize: `12${FS}`,
              textAlign: "center",
              fontFamily: "starjhol",
            }}
          >
            Where's vader
          </h1>
          <p
            style={{
              color: "gold",
              fontSize: `6${FS}`,
              textAlign: "center",
              fontFamily: "starjedi",
            }}
          >
            Race against the clock to find the three characters below in the
            lego Star Wars-themed Where's Waldo-style image. Enter your name and
            compete for a spot on the global leaderboard.
          </p>
          <button
            type="button"
            onClick={() => {
              visible.value = false;
              server.start();
            }}
            style={{
              color: "white",
              fontSize: `10${FS}`,
              fontFamily: "starjhol",
              border: "4px solid white",
              padding: `0 2${FS}`,
              textAlign: "center",
              borderRadius: "10px",
            }}
          >
            Start
          </button>
        </div>
      )}
    </>
  );
}

export default Start;
