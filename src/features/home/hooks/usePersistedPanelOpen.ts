import { useCallback, useState } from "react";
import {
  readStoredPanelOpen,
  writeStoredPanelOpen,
} from "../domain/homeLayoutConstants";

export function usePersistedPanelOpen(
  storageKey: string,
  defaultOpen = true,
) {
  const [open, setOpenState] = useState(() =>
    readStoredPanelOpen(storageKey, defaultOpen),
  );

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      writeStoredPanelOpen(storageKey, next);
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setOpenState((current) => {
      const next = !current;
      writeStoredPanelOpen(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return { open, toggle, setOpen };
}
