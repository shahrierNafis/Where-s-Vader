import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import DropDown from "./components/DropDown";
import Image from "./components/Image";
import Magnifier from "./components/Magnifier";
import ScrollUp from "./components/ScrollUp";
import ScrollDown from "./components/ScrollDown";
function App() {
  return (
    <>
      <Magnifier.Button></Magnifier.Button>
      <Image></Image>
      <DropDown></DropDown>
      <ScrollUp></ScrollUp>
      <ScrollDown></ScrollDown>
    </>
  );
}

export default App;
