// hooks/useToast.js
import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, title, description, variant }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, toast, dismiss };
}
