import React from "react";

/**
 * This hook will call the given callback only once
 */
export default function useOnce(callback: any) {
  React.useEffect(callback, []);
}
