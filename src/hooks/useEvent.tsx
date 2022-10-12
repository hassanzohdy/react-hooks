import { EventSubscription } from "@mongez/events";
import { useEffect } from "react";

/**
 * Clear the given event subscription on component unmount
 * The event subscription will be called only after component first render.
 * On component unmount, the even will be removed from the event loop for better performance.
 */
export default function useEvent(
  eventCallback: () => EventSubscription,
  dependencies: any[] = []
) {
  useEffect(() => {
    const subscription = eventCallback();
    return () => subscription.unsubscribe();
  }, dependencies);
}
