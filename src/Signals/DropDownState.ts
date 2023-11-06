import { signal } from "@preact/signals-react";

export type DropDownState = { value: { visible: boolean } };
export const dropDownState = signal({ visible: false });
