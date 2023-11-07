import background from "/background.jpg";
import server from "../server";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const FS = screen.height > screen.width ? "vw" : "vh";
function End() {
  const navigate = useNavigate();

  const input: React.RefObject<HTMLInputElement> = useRef(null);
  return (
    <>
      {server.list.value.length == 0 && (
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
          <div style={{ width: "100vw" }}></div>
          <h1
            style={{
              color: "gold",
              fontSize: `12${FS}`,
              textAlign: "center",
              fontFamily: "starjhol",
            }}
          >
            Enter your name
          </h1>
          {/* input */}
          <input
            ref={input}
            style={{
              color: "gold",
              backgroundColor: "black",
              fontSize: `6${FS}`,
              textAlign: "center",
              fontFamily: "starjhol",
              margin: `4${FS}`,
              border: "4px solid white",
              borderRadius: "10px",
            }}
            type="text"
          />
          <button
            type="button"
            onClick={() => {
              if (input?.current?.value) {
                if (input?.current?.value?.length > 2) {
                  server.submit(input.current.value);
                  navigate("/leader-board");
                } else {
                  alert("Name must be at least 3 characters");
                }
              }
            }}
            style={{
              color: "white",
              fontSize: `5${FS}`,
              fontFamily: "starjhol",
              border: "4px solid white",
              padding: `0 2${FS}`,
              textAlign: "center",
              borderRadius: "10px",
              margin: `4${FS}`,
            }}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}

export default End;
