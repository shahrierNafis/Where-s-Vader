import { ListGroup } from "react-bootstrap";
import { coordinates } from "../Signals/Coordinates";
import { dropDownState } from "../Signals/DropDownState";
import Target from "./Target";
import server from "../server";
import { useEffect, useRef } from "react";
import { magnifierState } from "../Signals/magnifierState";
const FS = screen.height > screen.width ? "vw" : "vh";

function DropDown() {
  const dropDownRef: React.RefObject<HTMLDivElement> = useRef(null);

  async function onClick(id: number, name: string) {
    const { imageX, imageY } = coordinates.value;

    if (await server.capture(id, imageX!, imageY!)) {
      right(name);
    } else {
      wrong();
    }

    dropDownState.value = { visible: false };
  }

  useEffect(() => {
    setTimeout(() => {
      if (dropDownRef.current == null) return;
      const { width, height } = dropDownRef.current.getBoundingClientRect();
      const { clientX, clientY } = coordinates.value;

      //top
      // if magnifier is used
      if (magnifierState.value.used) {
        if (clientY! - height > 0) {
          dropDownRef.current.style.top = `${clientY! + scrollY - height}px`;
        } else {
          dropDownRef.current.style.top = `${clientY! + scrollY}px`;
        }
      } else {
        // if magnifier is not used
        if (clientY! - height > 0) {
          dropDownRef.current.style.top = `${clientY! + scrollY - height}px`;
        } else {
          dropDownRef.current.style.top = `${clientY! + scrollY}px`;
        }
      }
      //left
      // if magnifier is used
      if (magnifierState.value.used) {
        if (clientX! - width > 0) {
          dropDownRef.current.style.left = `${clientX! - width}px`;
        } else {
          dropDownRef.current.style.left = `${clientX}px`;
        }
      } else {
        // if magnifier is not used
        if (clientX! - width > 0) {
          dropDownRef.current.style.left = `${clientX! - width}px`;
        } else {
          dropDownRef.current.style.left = `${clientX}px`;
        }
      }
    }, 100);
  });
  return (
    <>
      {dropDownState.value.visible && (
        <>
          <div
            style={{
              position: "absolute",
              height: document.body.scrollHeight,
              width: document.body.scrollWidth,
              top: 0,
              left: 0,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
            onClick={() => {
              dropDownState.value = { ...dropDownState.value, visible: false };
            }}
          >
            <div
              style={{
                color: "gray",
                fontSize: `3${FS}`,
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              press here to cancel
            </div>
          </div>
          <div
            ref={dropDownRef}
            style={{
              position: "absolute",
              pointerEvents: dropDownState.value.visible ? "auto" : "none",
              zIndex: 3,
            }}
          >
            <ListGroup>
              {server.list.value.map((target) => (
                <ListGroup.Item
                  key={target.id}
                  onClick={() => {
                    onClick(target.id, target.name);
                  }}
                >
                  <Target target={target}></Target>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </>
      )}
    </>
  );
}
function wrong() {
  const wrong = document.createElement("div");
  wrong.style.position = "fixed";
  wrong.style.top = "50%";
  wrong.style.left = "50%";
  wrong.style.transform = "translate(-50%, -50%)";

  wrong.style.color = "rgb(226, 134, 143)";
  wrong.style.fontSize = `4${FS}`;

  wrong.style.padding = `2${FS} 4${FS}`;

  wrong.style.border = "2px solid rgb(104, 17, 26)";

  wrong.style.background = "rgb(66, 11, 16)";
  wrong.style.borderRadius = "4px";
  wrong.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
  wrong.innerHTML = "wrong!";
  document.body.appendChild(wrong);
  setTimeout(() => {
    wrong.remove();
  }, 2000);
}
function right(name: string) {
  const right = document.createElement("div");
  right.style.position = "fixed";
  right.style.top = "50%";
  right.style.left = "50%";
  right.style.transform = "translate(-50%, -50%)";

  right.style.color = "rgb(153, 231, 171)";
  right.style.fontSize = `4${FS}`;

  right.style.padding = `2${FS} 4${FS}`;

  right.style.border = "2px solid rgb(36, 90, 49)";

  right.style.background = "rgb(25, 61, 40)";
  right.style.borderRadius = "4px";
  right.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
  right.innerHTML = name;
  document.body.appendChild(right);
  setTimeout(() => {
    right.remove();
  }, 2000);
}
export default DropDown;
