import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { borderColor, foreground, type ThemeMode } from "../domain/welcomeTheme";

const DRAG_THRESHOLD_PX = 5;
const VIEWPORT_MARGIN_PX = 12;

export interface DevResetFabProps {
  mode: ThemeMode;
  onReset: () => void | Promise<void>;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originLeft: number;
  originTop: number;
  dragging: boolean;
}

function clampToBounds(
  el: HTMLElement,
  left: number,
  top: number,
  boundsWidth: number,
  boundsHeight: number,
): { left: number; top: number } {
  const maxLeft = Math.max(
    VIEWPORT_MARGIN_PX,
    boundsWidth - el.offsetWidth - VIEWPORT_MARGIN_PX,
  );
  const maxTop = Math.max(
    VIEWPORT_MARGIN_PX,
    boundsHeight - el.offsetHeight - VIEWPORT_MARGIN_PX,
  );
  return {
    left: Math.min(Math.max(VIEWPORT_MARGIN_PX, left), maxLeft),
    top: Math.min(Math.max(VIEWPORT_MARGIN_PX, top), maxTop),
  };
}

function readPositionBounds(el: HTMLElement): { width: number; height: number } {
  const parent = el.offsetParent;
  if (parent instanceof HTMLElement) {
    return { width: parent.clientWidth, height: parent.clientHeight };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

export function DevResetFab({ mode, onReset }: DevResetFabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const clampPosition = useCallback((left: number, top: number) => {
    const el = containerRef.current;
    if (!el) return { left, top };
    const bounds = readPositionBounds(el);
    return clampToBounds(el, left, top, bounds.width, bounds.height);
  }, []);

  useLayoutEffect(() => {
    if (position === null) return;
    const reclamp = () => {
      const el = containerRef.current;
      if (!el) return;
      setPosition((current) => {
        if (!current) return current;
        const bounds = readPositionBounds(el);
        const next = clampToBounds(
          el,
          current.left,
          current.top,
          bounds.width,
          bounds.height,
        );
        if (next.left === current.left && next.top === current.top) {
          return current;
        }
        return next;
      });
    };
    reclamp();
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, [position]);

  const readPosition = () => {
    const el = containerRef.current;
    if (!el) return { left: 0, top: 0 };
    if (position) return position;
    return { left: el.offsetLeft, top: el.offsetTop };
  };

  const beginPointerInteraction = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const { left, top } = readPosition();
    if (!position) setPosition({ left, top });
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: left,
      originTop: top,
      dragging: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) return;
      drag.dragging = true;
      setIsDragging(true);
    }
    setPosition(clampPosition(drag.originLeft + deltaX, drag.originTop + deltaY));
  };

  const finishPointerInteraction = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const wasDragging = drag.dragging;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
    if (!wasDragging) {
      void onReset();
    }
  };

  return (
    <div
      ref={containerRef}
      className={[
        "welcome-dev-reset-fab",
        position ? "" : "welcome-dev-reset-fab-default",
        isDragging ? "is-dragging" : "",
      ].join(" ")}
      style={
        position
          ? {
              left: position.left,
              top: position.top,
              borderColor: borderColor(mode),
              color: foreground(mode, "primary"),
            }
          : {
              borderColor: borderColor(mode),
              color: foreground(mode, "primary"),
            }
      }
      onPointerDown={beginPointerInteraction}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={finishPointerInteraction}
      onDragStart={(event) => event.preventDefault()}
    >
      RESET
    </div>
  );
}
