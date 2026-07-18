import { useEffect, useState } from "react";

export function useResize() {
  const [resize, setResize] = useState(0);

  useEffect(() => {
    const getWidth = () => Math.round(window.visualViewport?.width ?? window.innerWidth);
    setResize(getWidth());
    const update = () => setResize(getWidth());
    const target = window.visualViewport ?? window;
    target.addEventListener("resize", update);
    return () => target.removeEventListener("resize", update);
  }, []);

  return resize;
}
