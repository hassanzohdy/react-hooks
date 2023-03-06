import React from "react";

/**
 * This hook will call the given callback only once
 */
export default function useOnce(callback: any) {
  const hasEffectBeenCalledRef = React.useRef(false);
  React.useEffect(() => {
    if (hasEffectBeenCalledRef.current) return;
    const output = callback();
    hasEffectBeenCalledRef.current = true;
    return output;
  }, []);
}
