import React from "react";

/**
 * Re-Render the component when the prop value is changed
 *
 * @example
 * ```
 * const [isDisabled, disable] = useStateDetector(props.disabled)
 * ```
 */
export default function useStateDetector<T>(incomingValue: T) {
  const [value, setValue] = React.useState(incomingValue);
  React.useEffect(() => {
    if (value === undefined) return;

    setValue(incomingValue);
  }, [incomingValue, setValue]);

  return [value, setValue];
}
