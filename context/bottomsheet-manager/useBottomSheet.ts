import React from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useBottomSheetManager } from "./context";
import type { BottomSheetId } from "./types";

export interface UseBottomSheetResult {
  id: BottomSheetId;
  open: () => void;
  close: () => void;
  expand: () => void;
  collapse: () => void;
  exists: boolean;
  ref?: React.RefObject<BottomSheetModal>;
}

export const useBottomSheet = (id: BottomSheetId): UseBottomSheetResult => {
  const manager = useBottomSheetManager();

  const open = React.useCallback(() => {
    manager.open(id);
  }, [manager, id]);

  const close = React.useCallback(() => {
    manager.close(id);
  }, [manager, id]);

  const expand = React.useCallback(() => {
    manager.expand(id);
  }, [manager, id]);

  const collapse = React.useCallback(() => {
    manager.collapse(id);
  }, [manager, id]);

  const exists = manager.has(id);
  const ref = manager.getRef(id);

  return {
    id,
    open,
    close,
    expand,
    collapse,
    exists,
    ref,
  };
};