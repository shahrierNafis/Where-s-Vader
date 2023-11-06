import { ListGroup } from "react-bootstrap";
import { coordinates } from "../Signals/Coordinates";
import { dropDownState } from "../Signals/DropDownState";
import Target from "./Target";
import server from "../server";

function DropDown() {
  function onClick(id: string) {
    console.log("clicked");

    const { imageX, imageY } = coordinates.value;
    if (imageX && imageY) {
      server.capture(id, imageX, imageY);
    }
    dropDownState.value.visible = false;
  }

  return (
    <>
      {dropDownState.value.visible && (
        <div
          style={{
            position: "absolute",
            top: coordinates.value.y,
            left: coordinates.value.x,
            pointerEvents: dropDownState.value.visible ? "auto" : "none",
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
      )}
    </>
  );
}

export default DropDown;
