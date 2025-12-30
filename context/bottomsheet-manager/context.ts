import React from "react";
import type { InternalBottomSheetManagerContext } from "./types";

const BottomSheetManagerContext =
  React.createContext<InternalBottomSheetManagerContext | null>(null);

export const useBottomSheetManager = () => {
  const ctx = React.useContext(BottomSheetManagerContext);
  if (!ctx) {
    throw new Error(
      "[@Ttete/bottom-sheet-manager] useBottomSheetManager must be used within <BottomSheetManagerProvider />"
    );
  }
  return ctx;
};

export { BottomSheetManagerContext };
