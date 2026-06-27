import { useSyncExternalStore } from 'react';

export type ShortcutRegistration = {
  id: string;
  keys: string[];
  source: string;
};

type Listener = () => void;

const registrations = new Map<string, ShortcutRegistration>();
const listeners = new Set<Listener>();

const IS_DEV = process.env.NODE_ENV === 'development';

function notify() {
  listeners.forEach((l) => l());
}

export const shortcutRegistry = {
  register(id: string, keys: string[], source: string) {
    if (!IS_DEV) return;
    registrations.set(id, { id, keys, source });
    notify();
  },
  unregister(id: string) {
    if (!IS_DEV) return;
    registrations.delete(id);
    notify();
  },
};

function getSnapshot(): ShortcutRegistration[] {
  return Array.from(registrations.values());
}

let cachedSnapshot: ShortcutRegistration[] = [];
function subscribe(listener: Listener) {
  listeners.add(listener);
  cachedSnapshot = getSnapshot();
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Logs all currently active shortcut listeners to the console.
 * Dev-only — no-op in production. Logs on every registration change.
 */
export function useShortcutDebug() {
  useSyncExternalStore(subscribe, () => {
    if (!IS_DEV) return cachedSnapshot;
    const next = getSnapshot();
    if (
      next.length !== cachedSnapshot.length ||
      next.some((r, i) => r.id !== cachedSnapshot[i]?.id)
    ) {
      cachedSnapshot = next;
      console.table(
        cachedSnapshot.map(({ keys, source }) => ({
          keys: keys.join(' + '),
          source,
        })),
      );
    }
    return cachedSnapshot;
  });
}
