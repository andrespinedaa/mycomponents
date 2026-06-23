import { useState, useCallback } from "react";

export interface UseDisclosureOptions {
  defaultOpened?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseDisclosureReturn {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure({
  defaultOpened = false,
  onOpen,
  onClose,
}: UseDisclosureOptions = {}): UseDisclosureReturn {
  const [opened, setOpened] = useState(defaultOpened);

  const open = useCallback(() => {
    setOpened((prev) => {
      if (!prev) onOpen?.();
      return true;
    });
  }, [onOpen]);

  const close = useCallback(() => {
    setOpened((prev) => {
      if (prev) onClose?.();
      return false;
    });
  }, [onClose]);

  const toggle = useCallback(() => {
    setOpened((prev) => {
      if (prev) onClose?.();
      else onOpen?.();
      return !prev;
    });
  }, [onOpen, onClose]);

  return { opened, open, close, toggle };
}
