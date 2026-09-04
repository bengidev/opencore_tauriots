import { useCallback, useEffect, useRef, useState } from "react";
import {
  clampWidth,
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  HOME_SIDEBAR_RESIZE_MIN_WIDTH_PX,
  readStoredSidebarWidth,
  resolveResizeEndAction,
  writeStoredSidebarWidth,
} from "../domain/homeLayoutConstants";

type ResizeSide = "left" | "right";

type UseResizableWidthOptions = {
  side: ResizeSide;
  storageKey: string;
  defaultWidth: number;
  maxWidth: number;
  collapseThreshold?: number;
  resizeMinWidth?: number;
  onRequestCollapse?: () => void;
};

type ResizeState = {
  pointerId: number;
  startX: number;
  initialWidth: number;
  moved: boolean;
};

export function useResizableWidth({
  side,
  storageKey,
  defaultWidth,
  maxWidth,
  collapseThreshold = HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  resizeMinWidth = HOME_SIDEBAR_RESIZE_MIN_WIDTH_PX,
  onRequestCollapse,
}: UseResizableWidthOptions) {
  const [width, setWidth] = useState(() =>
    readStoredSidebarWidth(storageKey, defaultWidth),
  );
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const suppressClickRef = useRef(false);
  const widthRef = useRef(width);
  const lastCommittedWidthRef = useRef(
    readStoredSidebarWidth(storageKey, defaultWidth),
  );

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    return () => {
      resizeStateRef.current = null;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };
  }, []);

  const commitWidth = useCallback(
    (nextWidth: number) => {
      const clamped = clampWidth(nextWidth, resizeMinWidth, maxWidth);
      setWidth(clamped);
      lastCommittedWidthRef.current = clamped;
      writeStoredSidebarWidth(storageKey, clamped);
      return clamped;
    },
    [maxWidth, resizeMinWidth, storageKey],
  );

  const collapsePanel = useCallback(() => {
    onRequestCollapse?.();
    setWidth(lastCommittedWidthRef.current);
    widthRef.current = lastCommittedWidthRef.current;
  }, [onRequestCollapse]);

  const endResize = useCallback(
    (pointerId: number) => {
      const resizeState = resizeStateRef.current;
      if (!resizeState || resizeState.pointerId !== pointerId) {
        return;
      }

      suppressClickRef.current = resizeState.moved;
      if (resizeState.moved) {
        const action = resolveResizeEndAction(
          widthRef.current,
          collapseThreshold,
          resizeMinWidth,
          maxWidth,
        );

        if (action === "collapse") {
          collapsePanel();
        } else {
          commitWidth(action.commitWidth);
        }
      }

      resizeStateRef.current = null;
      setIsResizing(false);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    },
    [collapsePanel, collapseThreshold, commitWidth, maxWidth, resizeMinWidth],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;

      resizeStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        initialWidth: widthRef.current,
        moved: false,
      };

      setIsResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const resizeState = resizeStateRef.current;
      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      const delta =
        side === "left"
          ? event.clientX - resizeState.startX
          : resizeState.startX - event.clientX;

      if (Math.abs(delta) > 2) {
        resizeState.moved = true;
      }

      const nextWidth = clampWidth(
        resizeState.initialWidth + delta,
        resizeMinWidth,
        maxWidth,
      );
      widthRef.current = nextWidth;
      setWidth(nextWidth);
    },
    [maxWidth, resizeMinWidth, side],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (resizeStateRef.current?.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      endResize(event.pointerId);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [endResize],
  );

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (resizeStateRef.current?.pointerId !== event.pointerId) {
        return;
      }

      endResize(event.pointerId);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [endResize],
  );

  const onClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    setWidth((current) => {
      const clamped = clampWidth(current, resizeMinWidth, maxWidth);
      if (clamped !== current) {
        lastCommittedWidthRef.current = clamped;
        writeStoredSidebarWidth(storageKey, clamped);
      }

      return clamped;
    });
  }, [maxWidth, resizeMinWidth, storageKey]);

  return {
    width,
    isResizing,
    resizeRailProps: {
      "aria-label":
        side === "left" ? "Resize left sidebar" : "Resize right sidebar",
      className:
        side === "left"
          ? "home-shell-resize-rail home-shell-resize-rail-right"
          : "home-shell-resize-rail home-shell-resize-rail-left",
      onClick,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      type: "button" as const,
    },
  };
}
