import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import DropDown from "./components/DropDown";
import Image from "./components/Image";
import Magnifier from "./components/Magnifier";
import ScrollUp from "./components/ScrollUp";
import ScrollDown from "./components/ScrollDown";
import Start from "./components/Start";
import Timer from "./components/Timer";
function App() {
  return (
    <>
      <Start />
      <div className="flex">
        <Magnifier.Button />
        <Timer />
      </div>

      <Image></Image>
      <DropDown />
      <ScrollUp />
      <ScrollDown />
    </>
  );
}

export default App;
