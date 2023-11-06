import { signal } from "@preact/signals-react";

export type MagnifierState = {
  value: { used: boolean; visible: boolean; aim: boolean };
};
export const magnifierState = signal({ used: true, visible: true, aim: false });
