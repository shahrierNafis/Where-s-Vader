import { Signal, signal } from "@preact/signals-react";
export const coordinates: Signal<Coordinates> = signal({});

export type Coordinates = {
  imageX?: number;
  imageY?: number;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  clientX?: number;
  clientY?: number;
};
