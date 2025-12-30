import React from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetManagerContext } from "./context";
import type {
  BottomSheetId,
  InternalBottomSheetManagerContext,
} from "./types";

export interface BottomSheetManagerProviderProps {
  children: React.ReactNode;
}

export const BottomSheetManagerProvider: React.FC<
  BottomSheetManagerProviderProps
> = ({ children }) => {
  const sheetsRef = React.useRef<
    Map<BottomSheetId, React.RefObject<BottomSheetModal>>
  >(new Map());

  const register = React.useCallback<
    InternalBottomSheetManagerContext["register"]
  >((id, ref) => {
    if (sheetsRef.current.has(id)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[@Ttete/bottom-sheet-manager] A sheet with id "${id}" is already registered. The last registered instance will be used.`
        );
      }
    }
    sheetsRef.current.set(id, ref);
  }, []);

  const unregister = React.useCallback<
    InternalBottomSheetManagerContext["unregister"]
  >((id, ref) => {
    const currentRef = sheetsRef.current.get(id);
    // Deletes only if the ref matches to avoid unregistering a different instance
    if (currentRef === ref) {
      sheetsRef.current.delete(id);
    }
  }, []);

  const open = React.useCallback<
    InternalBottomSheetManagerContext["open"]
  >((id) => {
    const ref = sheetsRef.current.get(id);
    if (!ref?.current) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[@Ttete/bottom-sheet-manager] Tried to open sheet "${id}" but it is not registered.`
        );
      }
      return;
    }
    ref.current.present();
  }, []);

  const close = React.useCallback<
    InternalBottomSheetManagerContext["close"]
  >((id) => {
    const ref = sheetsRef.current.get(id);
    if (!ref?.current) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[@Ttete/bottom-sheet-manager] Tried to close sheet "${id}" but it is not registered.`
        );
      }
      return;
    }
    ref.current.dismiss();
  }, []);

  const expand = React.useCallback<
    InternalBottomSheetManagerContext["expand"]
  >((id) => {
    const ref = sheetsRef.current.get(id);
    if (!ref?.current) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[@Ttete/bottom-sheet-manager] Tried to expand sheet "${id}" but it is not registered.`
        );
      }
      return;
    }
    ref.current.expand();
  }, []);

  const collapse = React.useCallback<
    InternalBottomSheetManagerContext["collapse"]
  >((id) => {
    const ref = sheetsRef.current.get(id);
    if (!ref?.current) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[@Ttete/bottom-sheet-manager] Tried to collapse sheet "${id}" but it is not registered.`
        );
      }
      return;
    }
    ref.current.collapse();
  }, []);

  const has = React.useCallback<
    InternalBottomSheetManagerContext["has"]
  >((id) => {
    return sheetsRef.current.has(id);
  }, []);

  const getRef = React.useCallback<
    InternalBottomSheetManagerContext["getRef"]
  >((id) => {
    return sheetsRef.current.get(id);
  }, []);

  const value = React.useMemo<InternalBottomSheetManagerContext>(
    () => ({
      register,
      unregister,
      open,
      close,
      expand,
      collapse,
      has,
      getRef,
    }),
    [register, unregister, open, close, expand, collapse, has, getRef]
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetManagerContext.Provider value={value}>
        {children}
      </BottomSheetManagerContext.Provider>
    </BottomSheetModalProvider>
  );
};
