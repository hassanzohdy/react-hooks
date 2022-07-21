import React from "react";

/**
 * This hook accepts a callback function when a client clicks outside the element
 * The returned value is a ref that will be attached to the DOM element.
 *
 * @example
 * ```
 * const ref = useOuterClick(() => console.log("Clicked outside"));
 * <div ref={ref}></div>
 * ```
 * @param
 * @returns Ref
 */

export default function useOuterClick<T extends HTMLElement>(
  callback: (e: React.SyntheticEvent, element: T) => void
) {
  const callbackRef = React.useRef<(e: any, element: T) => void>(); // initialize mutable ref, which stores callback
  const innerRef = React.useRef<T>(); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  React.useEffect(() => {
    if (!callbackRef.current) {
      callbackRef.current = callback;
    }
  });

  React.useEffect(() => {
    function handleClick(e: any) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      ) {
        callbackRef.current(e, innerRef.current);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref himself)
}
