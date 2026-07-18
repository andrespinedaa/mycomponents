import { useEffect, useState } from "react";

export function useResize() {
  const [resize, setResize] = useState(0);

  useEffect(() => {
    setResize(window.innerWidth);
    const update = () => setResize(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return resize;
}
