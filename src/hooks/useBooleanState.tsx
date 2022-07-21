import { useState, useMemo } from "react";

export default function useBooleanState(
  defaultValue: boolean = false
): [boolean, () => void, () => void, (state: boolean) => void] {
  const [booleanValue, setBooleanValue] = useState(defaultValue);

  const [setTrue, setFalse, toggle] = useMemo(() => {
    const setTrue = () => setBooleanValue(true);
    const setFalse = () => setBooleanValue(false);
    const toggle = () => setBooleanValue(!booleanValue);

    return [setTrue, setFalse, toggle];
  }, [booleanValue]);

  return [booleanValue, setTrue, setFalse, toggle];
}
