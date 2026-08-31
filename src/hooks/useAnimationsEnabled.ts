import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

export function useAnimationsEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const task = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed > 100) {
        setEnabled(false);
      }
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  return enabled;
}
