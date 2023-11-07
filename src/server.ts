import { signal, Signal } from "@preact/signals-react";
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
]);
const leaderboard = signal([
  { name: "shahrier", time: 10000000 },
  { name: "nafis" },
]);
const time: Signal<{ start: Date | null; end: Date | null }> = signal({
  start: null,
  end: null,
});
function updateList() {}
function capture(id: string, imageX: number, imageY: number) {
  list.value = list.value.filter((target) => {
    if (target._id === id) {
      return false;
    }
    return true;
  });
}
function start() {
  time.value = {
    start: new Date(),
    end: null,
  };
}
function submit(name: string) {
  if (time.value.start) {
    leaderboard.value.push({
      name,
      time: new Date().getTime() - time.value.start.getTime(),
    });
  }
}
export default { updateList, capture, list, start, time, submit };
