import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const COMPOSER_MIN_ROWS = 1;
const COMPOSER_MAX_ROWS = 6;

const MODEL_OPTIONS = ["Add OpenRouter API key"] as const;
const PRIORITY_OPTIONS = ["High", "Normal"] as const;
const MODE_OPTIONS = ["Build", "Plan", "Ask"] as const;
const ACCESS_OPTIONS = ["Full access", "Read only", "Ask before edits"] as const;

/** Placeholder until real context tracking is wired. */
const DEFAULT_CONTEXT_PERCENT = 85;

type ComposerField = "model" | "priority" | "mode" | "access";

interface ComposerState {
  model: string;
  priority: string;
  mode: string;
  access: string;
}

const DEFAULT_COMPOSER_STATE: ComposerState = {
  model: MODEL_OPTIONS[0],
  priority: PRIORITY_OPTIONS[0],
  mode: MODE_OPTIONS[0],
  access: ACCESS_OPTIONS[0],
};

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3.5 12.5 9H9.5V12.5H6.5V9H3.5L8 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="4.5"
        y="4.5"
        width="7"
        height="7"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M6.5 1.5V4M9.5 1.5V4M6.5 12V14.5M9.5 12V14.5M1.5 6.5H4M12 6.5H14.5M1.5 9.5H4M12 9.5H14.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="9"
        height="7"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M6 5.5V4a2 2 0 0 1 4 0v1.5M8 2.5v1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <circle cx="6" cy="9" r="0.75" fill="currentColor" />
      <circle cx="10" cy="9" r="0.75" fill="currentColor" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 6.5 8 10.5 12 6.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

interface ComposerDropdownProps {
  id: string;
  label: string;
  section: string;
  options: readonly string[];
  value: string;
  icon?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}

function ComposerDropdown({
  id,
  label,
  section,
  options,
  value,
  icon,
  open,
  onOpenChange,
  onSelect,
}: ComposerDropdownProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedIndex = options.indexOf(value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open, onOpenChange, options, value]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    },
    [onOpenChange],
  );

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((current) => (current + 1) % options.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex(
            (current) => (current - 1 + options.length) % options.length,
          );
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(options.length - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onSelect(options[activeIndex]);
          onOpenChange(false);
          triggerRef.current?.focus();
          break;
        case "Escape":
          event.preventDefault();
          onOpenChange(false);
          triggerRef.current?.focus();
          break;
        default:
          break;
      }
    },
    [activeIndex, onOpenChange, onSelect, options],
  );

  return (
    <div className="home-workspace-composer-dropdown" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="home-workspace-composer-toolbar-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => onOpenChange(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        {icon ? (
          <span className="home-workspace-composer-toolbar-icon">{icon}</span>
        ) : null}
        <span className="home-workspace-composer-toolbar-label">{label}</span>
        <span className="home-workspace-composer-toolbar-caret">
          <ChevronDownIcon />
        </span>
      </button>

      {open ? (
        <div
          id={listboxId}
          className="home-workspace-composer-menu"
          role="listbox"
          aria-label={section}
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
        >
          <p className="home-workspace-composer-menu-heading">{section}</p>
          {options.map((option, index) => (
            <button
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              className="home-workspace-composer-menu-item"
              onClick={() => {
                onSelect(option);
                onOpenChange(false);
                triggerRef.current?.focus();
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function resizeComposer(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  const style = getComputedStyle(textarea);
  const lineHeight = Number.parseFloat(style.lineHeight);
  const minHeight = Number.parseFloat(style.minHeight);
  const maxHeight = lineHeight * COMPOSER_MAX_ROWS;
  const nextHeight = Math.max(
    minHeight,
    Math.min(textarea.scrollHeight, maxHeight),
  );
  textarea.style.height = `${nextHeight}px`;
}

export interface WorkspaceComposerProps {
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}

export function WorkspaceComposer({ textareaRef }: WorkspaceComposerProps = {}) {
  const textareaId = useId();
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const resolvedTextareaRef = textareaRef ?? internalTextareaRef;
  const [draft, setDraft] = useState("");
  const [composer, setComposer] = useState(DEFAULT_COMPOSER_STATE);
  const [openDropdown, setOpenDropdown] = useState<ComposerField | null>(null);

  const selectOption = useCallback((field: ComposerField, value: string) => {
    setComposer((current) => ({ ...current, [field]: value }));
  }, []);

  const submitComposer = useCallback(() => {
    if (draft.trim().length === 0) {
      return;
    }
    setDraft("");
    if (resolvedTextareaRef.current) {
      resolvedTextareaRef.current.style.height = "auto";
      resizeComposer(resolvedTextareaRef.current);
    }
  }, [draft, resolvedTextareaRef]);

  const focusComposer = useCallback(() => {
    resolvedTextareaRef.current?.focus();
  }, [resolvedTextareaRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitComposer();
      }
    },
    [submitComposer],
  );

  const handleChange = useCallback(
    (value: string) => {
      setDraft(value);
      if (resolvedTextareaRef.current) {
        resizeComposer(resolvedTextareaRef.current);
      }
    },
    [resolvedTextareaRef],
  );

  useEffect(() => {
    if (resolvedTextareaRef.current) {
      resizeComposer(resolvedTextareaRef.current);
    }
  }, [resolvedTextareaRef]);

  const canSend = draft.trim().length > 0;

  return (
    <div className="home-workspace-composer">
      <div className="home-workspace-composer-shell">
        <div
          className="home-workspace-composer-input-row"
          onClick={focusComposer}
        >
          <textarea
            ref={resolvedTextareaRef}
            id={textareaId}
            className="home-workspace-composer-input"
            rows={COMPOSER_MIN_ROWS}
            placeholder="Ask anything…"
            value={draft}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="home-workspace-composer-divider" aria-hidden="true" />

        <div className="home-workspace-composer-toolbar">
          <ComposerDropdown
            id="workspace-composer-model"
            label={composer.model}
            section="Model"
            options={MODEL_OPTIONS}
            value={composer.model}
            icon={<CpuIcon />}
            open={openDropdown === "model"}
            onOpenChange={(nextOpen) =>
              setOpenDropdown(nextOpen ? "model" : null)
            }
            onSelect={(value) => selectOption("model", value)}
          />
          <div className="home-workspace-composer-toolbar-sep" aria-hidden="true" />
          <ComposerDropdown
            id="workspace-composer-priority"
            label={composer.priority}
            section="Priority"
            options={PRIORITY_OPTIONS}
            value={composer.priority}
            open={openDropdown === "priority"}
            onOpenChange={(nextOpen) =>
              setOpenDropdown(nextOpen ? "priority" : null)
            }
            onSelect={(value) => selectOption("priority", value)}
          />
          <div className="home-workspace-composer-toolbar-sep" aria-hidden="true" />
          <ComposerDropdown
            id="workspace-composer-mode"
            label={composer.mode}
            section="Mode"
            options={MODE_OPTIONS}
            value={composer.mode}
            icon={<BotIcon />}
            open={openDropdown === "mode"}
            onOpenChange={(nextOpen) =>
              setOpenDropdown(nextOpen ? "mode" : null)
            }
            onSelect={(value) => selectOption("mode", value)}
          />
          <div className="home-workspace-composer-toolbar-sep" aria-hidden="true" />
          <ComposerDropdown
            id="workspace-composer-access"
            label={composer.access}
            section="Access"
            options={ACCESS_OPTIONS}
            value={composer.access}
            icon={<EyeIcon />}
            open={openDropdown === "access"}
            onOpenChange={(nextOpen) =>
              setOpenDropdown(nextOpen ? "access" : null)
            }
            onSelect={(value) => selectOption("access", value)}
          />

          <div className="home-workspace-composer-toolbar-spacer" />

          <div className="home-workspace-composer-actions">
            <div
              className="home-workspace-composer-context"
              aria-label={`Context usage ${DEFAULT_CONTEXT_PERCENT} percent`}
            >
              {DEFAULT_CONTEXT_PERCENT}
            </div>

            <button
              type="button"
              className="home-workspace-composer-send"
              aria-label="Send atom"
              disabled={!canSend}
              onClick={submitComposer}
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </div>

      <p className="home-workspace-composer-hint">
        Enter to send atom · Shift+Enter for newline
      </p>
    </div>
  );
}
