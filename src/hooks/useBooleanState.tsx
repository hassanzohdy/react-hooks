import { useState } from "react";

export default function useBooleanState(defaultValue: boolean = false) {
  const [booleanValue, setBooleanValue] = useState(defaultValue);

  const setTrue = () => setBooleanValue(true);
  const setFalse = () => setBooleanValue(false);
  const toggle = () => setBooleanValue(!booleanValue);

  return [booleanValue, setTrue, setFalse, toggle] as const;
}
