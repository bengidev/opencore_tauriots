import { useEffect, useState } from "react";
import type { WindowViewport } from "../domain/heroLayout";

export function readWindowViewport(): WindowViewport {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useWindowViewport(): WindowViewport {
  const [viewport, setViewport] = useState(readWindowViewport);

  useEffect(() => {
    const onResize = () => setViewport(readWindowViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
}
