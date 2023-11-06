import { signal } from "@preact/signals-react";
const list = signal([
  {
    name: "a",
    _id: "12345",
    img: "http://192.168.1.7:8000/Screenshot_20231106_093030.png",
  },
  {
    name: "b",
    _id: "67890",
    img: "http://192.168.1.7:8000/Screenshot_20231106_093030.png",
  },
  {
    name: "c",
    _id: "987654",
    img: "http://192.168.1.7:8000/Screenshot_20231106_093030.png",
  },
  {
    name: "d",
    _id: "776567463",
    img: "http://192.168.1.7:8000/Screenshot_20231106_093030.png",
  },
  {
    name: "e",
    _id: "765654535435",
    img: "http://192.168.1.7:8000/Screenshot_20231106_093030.png",
  },
]);
function updateList() {}
function capture(id: string, imageX: number, imageY: number) {
  list.value = list.value.filter((target) => {
    if (target._id === id) {
      return false;
    }
    return true;
  });
}
export default { updateList, capture, list };
