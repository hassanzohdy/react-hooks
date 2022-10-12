# Mongez React Hooks (MRH)

A useful list of React hooks that will make your life easier while developing your react js / react native project

## Installation

`yarn add @mongez/react-hooks`

Or

`npm i @mongez/react-hooks`

## useBooleanState

`useBooleanState(defaultValue: boolean = false): [value: boolean, setTrue: Function, setFalse: Function, toggle: Function]`

A handy hook that toggle a boolean state and return direct functions for updating boolean values.

```tsx
import { useBooleanState } from '@mongez/react-hooks';

export function HelloWorld() {
  const [isOpened, open, close] = useState(); // if no argument passed, then default value is false

  return (
    <>
    <div>The Door Now Is {isOpened ? 'Opened' : 'Closed'}</div>
      <button onClick={open}>Open The Door</button>
      <button onClick={close}>Close The Door</button>
    </button>
  )
}
```

## useFetcher

This is a powerful fetcher hook that will help you to fetch data from the server and handle the loading state and errors.

```tsx
import { useFetcher } from '@mongez/react-hooks';
import { getProductsList } from './api';

export default function ProductsList() {
  const {records, isLoading, error, loadMore, goToPage, totalPages, isLastPage, currentPage } = useFetcher(params => getProductList(params));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {records.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={loadMore}>Load More</button>

      <button onClick={() => goToPage(2)}>Go To Page 2</button>
    </>
  );
}
```

## useInputValue

`useInputValue<T>(defaultValue: T): [T: ((newValue): any => void)]`

This hook can be very useful when working with form inputs so it will give you an easier state changer callback to update the input value automatically.

The normal way is:

```tsx
import { useState } from "react";

export function HelloWorld() {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="username"
        placeholder="username"
      />
    </>
  );
}
```

With `useInputValue`

```tsx
import { useInputValue } from "@mongez/react-hooks";

export function HelloWorld() {
  const [value, setValue] = useInputValue("");

  return (
    <>
      <input
        value={value}
        onChange={setValue}
        name="username"
        placeholder="username"
      />
    </>
  );
}
```

It can take the value from various types,as the `onChange` sends an event `e`, the `useInputValue` valueDetector will try to get the value from any of the following

- `e.target.value`
- `e.value`
- `e.id`
- `e.text`
- `e`

If no value for `e` it will be set as empty string.

## useOnce

`useOnce(callback: () => (void | Destructor))`

Works exactly the same as `useEffect(() => {}, [])` but this one will relive you from adding the second argument and will skip the eslint checker for any missing dependencies that will not reflect on the side effect.

> Please note that this hook will ignore any updates that occurs to any states/variables inside it as it will be executed only once after the first render.

## useForceUpdate

`useForceUpdate(): () => void`

A very useful hook when you want to re-render the component without using the `useState` hook.

```tsx
import { useForceUpdate } from "@mongez/react-hooks";

export function HelloWorld() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // just dummy example for demonstration
    document.addEventListener("scroll", () => {
      forceUpdate();
    });
  }, []);

  // this value will be updated each time the user scrolls up or down
  const scrollTop = window.pageYOffset;

  return (
    <>
      <div>Scroll Top Position Is: ${scrollTop}</div>
    </>
  );
}
```

## useOuterClick

This hook will allow you to detect when the user clicks outside an element.

> Doesn't work with React Native.

```tsx
import { useOuterClick } from "@mongez/react-hooks";

export function HelloWorld() {
  const divRef = useOuterClick((e, element) => {
    console.log("Clicked outside!");
  });

  return (
    <>
      <div ref={divRef}>This</div>
    </>
  );
}
```

The `e` represents the click event and the element represent the value of the `divRef`'s current element.

## useStateDetector

`useStateDetector(propValue: any): [propValue: any, valueUpdater: (newValue: any) => void]`

This hook works exactly the same as `useState` except it will be updated if the given value is updated.

This one is very useful if you're relying on a value passed from the parent component and needs to detect if it has been changed.

```tsx
export function ParentComponent() {
  const [disabledValue, setDisabled] = useState(false);

  return (
    <>
      <button onClick={() => setDisabled(!disabledValue)}>
        Toggle Child Button State: ({disabledValue ? "Enabled" : "Disabled"})
      </button>
      <ChildComponent disabled={disabledValue} />
    </>
  );
}

function ChildComponent({ disabled }) {
  const [internalDisabled, setDisabled] = useState(disabled);

  return <>Child Component is: {internalDisabled}</>;
}
```

After the first click on the button the value will remain false, now let's try `useStateDetector`

```tsx
import { useStateDetector } from "@mongez/react-hooks";

export function ParentComponent() {
  const [disabledValue, setDisabled] = useState(false);

  return (
    <>
      <button onClick={() => setDisabled(!disabledValue)}>
        Toggle Child Button State: ({disabledValue ? "Enabled" : "Disabled"})
      </button>
      <ChildComponent disabled={disabledValue} />
    </>
  );
}

function ChildComponent({ disabled }) {
  const [internalDisabled, setDisabled] = useStateDetector(disabled);

  return <>Child Component is: {internalDisabled}</>;
}
```

In this case it will always get updated whenever the passed `disabled` prop in the `ChildComponent` is updated.

## useScroll

`useScroll(element: HTMLElement|Ref = document): number`

> Doesn't work with React Native.

This hook get the current scroll position value of the given element to the hook and return it.

This hook also will rerender the component when the scroll position is changed and return the new value

```tsx
import { useScroll } from "@mongez/react-hooks";

export function HelloWorld() {
  const windowScroll = useScroll();

  console.log(windowScroll); // will get the scroll position of the window itself
  return (
    <>
      <div
        height={{
          style: "1500px",
        }}
      >
        Some large content
      </div>
    </>
  );
}
```

```tsx
import { useScroll } from "@mongez/react-hooks";

export function HelloWorld() {
  const divRef = useRef();

  const divScroll = useScroll(divRef);

  console.log(divScroll); // will get the scroll position of the div

  return (
    <>
      <div
        ref={divRef}
        height={{
          style: "1500px",
          overflow: "auto",
        }}
      >
        Some large content
      </div>
    </>
  );
}
```

## TODO

- Added `cache` to `useFetcher` and `useRequest` hook.
