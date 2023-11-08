import { ListGroup } from "react-bootstrap";
import { coordinates } from "../Signals/Coordinates";
import { dropDownState } from "../Signals/DropDownState";
import Target from "./Target";
import server from "../server";
import { useEffect, useRef } from "react";
import { magnifierDiameter, magnifierState } from "../Signals/magnifierState";
const FS = screen.height > screen.width ? "vw" : "vh";

function DropDown() {
  const dropDownRef: React.RefObject<HTMLDivElement> = useRef(null);

  function onClick(id: string) {
    console.log("clicked");

    const { imageX, imageY } = coordinates.value;
    if (imageX && imageY) {
      server.capture(id, imageX, imageY);
    }
    dropDownState.value.visible = false;
  }

  useEffect(() => {
    setTimeout(() => {
      if (dropDownRef.current == null) return;
      const { width, height } = dropDownRef.current.getBoundingClientRect();
      const { clientX, clientY } = coordinates.value;
      if (!clientX || !clientY) return;

      //top
      // if magnifier is used
      if (magnifierState.value.used) {
        if (clientY - height > 0) {
          dropDownRef.current.style.top = `${clientY + scrollY - height}px`;
        } else {
          dropDownRef.current.style.top = `${clientY + scrollY}px`;
        }
      } else {
        // if magnifier is not used
        if (clientY - height > 0) {
          dropDownRef.current.style.top = `${clientY + scrollY - height}px`;
        } else {
          dropDownRef.current.style.top = `${clientY + scrollY}px`;
        }
      }
      //left
      // if magnifier is used
      if (magnifierState.value.used) {
        if (clientX - width > 0) {
          dropDownRef.current.style.left = `${clientX - width}px`;
        } else {
          dropDownRef.current.style.left = `${clientX}px`;
        }
      } else {
        // if magnifier is not used
        if (clientX - width > 0) {
          dropDownRef.current.style.left = `${clientX - width}px`;
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
                  key={target._id}
                  onClick={() => {
                    onClick(target._id);
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

export default DropDown;
