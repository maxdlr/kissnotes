import type { ElementType } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { ModName } from "@/components/ShortCut";

// ─── ModName — must match your Shortcut component's index.ts ─────────────────

// Maps ModName → the KeyboardEvent.key value the browser actually fires
const MOD_TO_KEY: Record<ModName, string> = {
  cmd: "Meta",
  opt: "Alt",
  shift: "Shift",
  capslock: "CapsLock",
  enter: "Enter",
  ctrl: "Control",
  backspace: "Backspace",
  del: "Delete",
  tab: "Tab",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

// Modifier keys that go into KeyboardEvent's boolean flags
const MODIFIER_KEYS = new Set<ModName>(["cmd", "opt", "shift", "ctrl"]);

// ─── Shortcut definition ──────────────────────────────────────────────────────

/**
 * A shortcut definition. Pass this to `useKeyboardShortcut` to register the
 * listener AND to `<Shortcut keys={shortcut.keys} />` to render the badge.
 *
 * @example
 * const shortcut: ShortcutDef = { keys: ["cmd", "k"] };
 * useKeyboardShortcut(shortcut, () => openSearch());
 * return shortcut && <Shortcut keys={shortcut.keys} />;
 */
export interface ShortcutDef {
  /** Same array you pass to <Shortcut keys={...} /> */
  keys: (string | ElementType | ModName)[];
  /** Ignore when focus is inside an input/textarea/select (default: true) */
  ignoreInputs?: boolean;
  /** Call e.preventDefault() when the shortcut fires (default: false) */
  preventDefault?: boolean;
  /** "keydown" | "keyup" (default: "keydown") */
  event?: "keydown" | "keyup";
  /** Attach to a specific element instead of window */
  target?: HTMLElement | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShortcut(
  shortcut: ShortcutDef | null | undefined,
  handler: (e: KeyboardEvent) => void,
) {
  const {
    keys = [],
    ignoreInputs = true,
    preventDefault = false,
    event = "keydown",
    target = null,
  } = shortcut ?? {};

  // Stable handler ref — callers don't need useCallback
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Derive trigger key + required modifiers from the keys array
  const { triggerKey, modifiers } = deriveKeys(keys);

  const listener = useCallback(
    (e: Event) => {
      if (!triggerKey) return;
      const ke = e as KeyboardEvent;

      if (ignoreInputs) {
        const tag = (ke.target as HTMLElement)?.tagName;
        if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
        if ((ke.target as HTMLElement)?.isContentEditable) return;
      }

      // All required modifiers must be pressed …
      if (modifiers.ctrl !== ke.ctrlKey) return;
      if (modifiers.meta !== ke.metaKey) return;
      if (modifiers.alt !== ke.altKey) return;
      if (modifiers.shift !== ke.shiftKey) return;

      if (ke.key.toLowerCase() !== triggerKey.toLowerCase()) return;

      if (preventDefault) ke.preventDefault();
      handlerRef.current(ke);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      triggerKey,
      modifiers.ctrl,
      modifiers.meta,
      modifiers.alt,
      modifiers.shift,
      ignoreInputs,
      preventDefault,
    ],
  );

  useEffect(() => {
    if (!triggerKey) return;
    const el: EventTarget = target ?? window;
    el.addEventListener(event, listener);
    return () => el.removeEventListener(event, listener);
  }, [target, event, listener, triggerKey]);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface Modifiers {
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
}

function deriveKeys(keys: ShortcutDef["keys"]): {
  triggerKey: string | null;
  modifiers: Modifiers;
} {
  const modifiers: Modifiers = {
    ctrl: false,
    meta: false,
    alt: false,
    shift: false,
  };
  let triggerKey: string | null = null;

  for (const key of keys) {
    if (typeof key !== "string") continue; // ElementType — display only, skip

    const mod = key as ModName;

    if (mod === "cmd") {
      modifiers.meta = true;
      continue;
    }
    if (mod === "opt") {
      modifiers.alt = true;
      continue;
    }
    if (mod === "shift") {
      modifiers.shift = true;
      continue;
    }
    if (mod === "ctrl") {
      modifiers.ctrl = true;
      continue;
    }

    // Non-modifier ModName (arrows, enter, etc.) → resolve to browser key
    if (mod in MOD_TO_KEY) {
      triggerKey = MOD_TO_KEY[mod];
      continue;
    }

    // Plain string like "k", "s", "?"
    triggerKey = key;
  }

  return { triggerKey, modifiers };
}
