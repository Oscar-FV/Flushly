import React from "react";
import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { useBottomSheetManager } from "./context";
import type { BottomSheetId } from "./types";

export interface ManagedBottomSheetProps
  extends Omit<BottomSheetModalProps, "ref"> {
  id: BottomSheetId;
  /**
   * Optional external ref to access the underlying BottomSheetModal.
   * This is an advanced escape hatch.
   */
  innerRef?: React.Ref<BottomSheetModal>;
}

export const ManagedBottomSheet: React.FC<ManagedBottomSheetProps> = ({
  id,
  innerRef,
  children,
  ...rest
}) => {
  const { register, unregister } = useBottomSheetManager();
  const localRef = React.useRef<BottomSheetModal>(null) as React.RefObject<
    BottomSheetModal
  >;

  // Register and unregister the sheet
  React.useEffect(() => {
    register(id, localRef);
    return () => {
      unregister(id, localRef);
    };
  }, [id, register, unregister]);

  // Sync innerRef with localRef if provided
  React.useEffect(() => {
    if (!innerRef) return;

    if (typeof innerRef === "function") {
      innerRef(localRef.current);
      return () => {
        innerRef(null);
      };
    }

    innerRef.current = localRef.current;

    return () => {
      innerRef.current = null;
    };
  }, [innerRef]);

  return (
    <BottomSheetModal ref={localRef} {...rest}>
      {children}
    </BottomSheetModal>
  );
};
