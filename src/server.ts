import { signal, Signal } from "@preact/signals-react";
import { jwtDecode } from "jwt-decode";

const token = signal<string | null>(null);

const list = signal<{ id: number; name: string; img: string }[]>([
  { id: 0, name: "error", img: "" },
]);

const time: Signal<{ start: Date | null }> = signal({
  start: null,
  end: null,
});

async function start() {
  token.value = await (
    await fetch(import.meta.env.VITE_API_URL + "/start", {
      method: "POST",
      mode: "cors",
    })
  ).json();
  list.value = Array.from(
    jwtDecode<JwtPayload>(token.value ? token.value : "").list
  );
  time.value = {
    start: new Date(),
  };
}

async function capture(id: number, imageX: number, imageY: number) {
  const response = await fetch(import.meta.env.VITE_API_URL + "/capture", {
    method: "POST",
    mode: "cors",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      x: imageX,
      y: imageY,
      token: token.value,
    }),
  });
  if (response.ok) {
    token.value = await response.json();
    list.value = Array.from(
      jwtDecode<JwtPayload>(token.value ? token.value : "").list
    );
    return true;
  }
  return false;
}

function submit(name: string) {
  fetch(import.meta.env.VITE_API_URL + "/submit", {
    method: "POST",
    mode: "cors",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      token: token.value,
    }),
  });
}
async function getLeaderBoard() {
  const leaderBoard = await (
    await fetch(import.meta.env.VITE_API_URL + "/leader-board")
  ).json();

  return leaderBoard;
}
export default {
  start,
  capture,
  submit,
  list,
  time,
  getLeaderBoard,
};
interface JwtPayload {
  name?: string;
  start: Date;
  end?: Date;
  list: Array<{ name: string; id: number; img: string }>;
}
