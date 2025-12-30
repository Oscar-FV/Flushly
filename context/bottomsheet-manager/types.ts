import type React from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

export type BottomSheetId = string;


export interface BottomSheetManagerApi {
  open: (id: BottomSheetId) => void;
  close: (id: BottomSheetId) => void;
  expand: (id: BottomSheetId) => void;
  collapse: (id: BottomSheetId) => void;
  has: (id: BottomSheetId) => boolean;
  getRef: (
    id: BottomSheetId
  ) => React.RefObject<BottomSheetModal> | undefined;
}

export interface InternalBottomSheetManagerContext
  extends BottomSheetManagerApi {
  register: (
    id: BottomSheetId,
    ref: React.RefObject<BottomSheetModal>
  ) => void;
  unregister: (
    id: BottomSheetId,
    ref: React.RefObject<BottomSheetModal>
  ) => void;
}
