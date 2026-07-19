import { useEffect, useState } from "react";

export function useResize() {
  const [resize, setResize] = useState(0);

  useEffect(() => {
    const getWidth = () => Math.round(window.visualViewport?.width ?? window.innerWidth);
    setResize(getWidth());
    const ro = new ResizeObserver(() => setResize(getWidth()));
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return resize;
}
