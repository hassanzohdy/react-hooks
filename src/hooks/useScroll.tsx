import { RefObject, useEffect, useState } from "react";

/**
 * Detect the scroll position of a given element, also watch for scroll position on moving up and down0
 */
export default /**
 * Detect the scroll position of a given element, also watch for scroll position on moving up and down0
 */
function useScroll(
  ref: RefObject<HTMLElement | Document | null> = {
    current: document,
  }
) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let element = ref.current;
    if (!element) return;

    if (element instanceof Document) {
      element = element.documentElement;
    }

    const handleScroll = () => {
      setScroll(element.scrollTop);
    };
    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [ref.current]);

  return scroll;
}
