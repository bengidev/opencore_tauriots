import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

const EXIT_FALLBACK_MS = 180;

export interface SnackbarProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
  className?: string;
}

export function Snackbar({
  message,
  onDismiss,
  durationMs = 3200,
  className,
}: SnackbarProps) {
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const dismissTimerRef = useRef<number | null>(null);
  const exitFallbackRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (exitFallbackRef.current !== null) {
      window.clearTimeout(exitFallbackRef.current);
      exitFallbackRef.current = null;
    }
  }, []);

  const finishExit = useCallback(() => {
    setDisplayMessage(null);
    onDismiss();
  }, [onDismiss]);

  const startExit = useCallback(() => {
    setVisible(false);
    exitFallbackRef.current = window.setTimeout(finishExit, EXIT_FALLBACK_MS);
  }, [finishExit]);

  useEffect(() => {
    clearTimers();

    if (!message) {
      return;
    }

    setDisplayMessage(message);

    const enterFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    dismissTimerRef.current = window.setTimeout(startExit, durationMs);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimers();
    };
  }, [message, durationMs, startExit, clearTimers]);

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "opacity" || visible) {
        return;
      }

      if (exitFallbackRef.current !== null) {
        window.clearTimeout(exitFallbackRef.current);
        exitFallbackRef.current = null;
      }

      finishExit();
    },
    [finishExit, visible],
  );

  if (!displayMessage) {
    return null;
  }

  return (
    <div className={["ds-snackbar-host", className].filter(Boolean).join(" ")}>
      <div
        className="ds-snackbar"
        role="status"
        aria-live="polite"
        data-visible={visible}
        onTransitionEnd={handleTransitionEnd}
      >
        {displayMessage}
      </div>
    </div>
  );
}
