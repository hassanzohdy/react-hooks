import { useState } from "react";

export default function useBooleanState(
  defaultValue: boolean = false
): [boolean, () => void, () => void, (state: boolean) => void] {
  const [booleanValue, setBooleanValue] = useState(defaultValue);

  const setTrue = () => setBooleanValue(true);
  const setFalse = () => setBooleanValue(false);
  const toggle = () => setBooleanValue(!booleanValue);

  return [booleanValue, setTrue, setFalse, toggle];
}
