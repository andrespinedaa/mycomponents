import { useEffect, useState } from "react";

export function useResize() {
  const [resize, setResize] = useState(0);

  useEffect(() => {
    setResize(window.innerWidth);
    let raf: ReturnType<typeof requestAnimationFrame>;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setResize(window.innerWidth));
    };
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return resize;
}
