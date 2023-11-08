import { signal } from "@preact/signals-react";

export type MagnifierState = {
  value: { used: boolean; visible: boolean; aim: boolean };
};
export const magnifierState = signal({ used: true, visible: true, aim: false });
export const magnifierDiameter =
  window.innerWidth < window.innerHeight
    ? window.innerWidth * 0.75
    : window.innerHeight * 0.45;
