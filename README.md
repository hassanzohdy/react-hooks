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

## useRequest

Sometimes we might need to load data from the server, and we need to handle the loading state, the error state, and the success state. This hook will help you to do that.

```tsx
import { useRequest } from '@mongez/react-hooks';
import getUserData from './getUserData';

export function HelloWorld() {
  const { response, loading, error } = useRequest(() => getUserData());

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{response.data.title}</div>;
}
```

## useFetcher

This is a powerful fetcher hook that will help you to fetch data from the server and handle the loading state and errors but with more configurations.

```tsx
import { useFetcher } from '@mongez/react-hooks';
import { getProductsList } from './api';

export default function ProductsList() {
  const {records, isLoading, error, loadMore, goToPage } = useFetcher(params => getProductList(params));

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

You can also know which is the current page you're on by using `currentPage` property.

Another cool feature is `paginatable` property which tells you whether you should display the pagination buttons or not.

You might also use `isLastPage` to know if you're on the last page or not so you can disable the `load more` button.

Here are the entire properties you can use:

```tsx
type FetcherOutput = {
  records: any[]; // the fetched records
  error: null | any; // the error if any
  load: (params?: Record<string, any>) => Promise<any>; // load the data
  reload: (params?: Record<string, any>) => Promise<any>; // reload the same data
  isLoading: boolean; // whether the data is loading or not
  loadMore: (params?: Record<string, any>) => Promise<any>; // load more data
  goToPage: (page: number) => Promise<any>; // go to a specific page
  reset: () => Promise<any>; // load the default params 
  isFirstPage: boolean; // whether you're on the first page or not
  isLastPage: boolean; // whether you're on the last page or not
  currentPage: number; // the current page you're on
  response?: AxiosResponse;// the response object
  totalPages: number; // the total pages
  totalRecords: number; // the total records
  currentRecords: number; // the current records
  defaultParams: Record<string, any>; // the default params that will be passed to the fetcher method on each request beside the current params
  params: Record<string, any>; // the current params
  paginatable: boolean; // whether the data is paginatable or not
}
```

Also you can set fetching options by passing it as the second argument to the `useFetcher` hook.

```tsx
const {records, isLoading, error, loadMore, goToPage } = useFetcher(params => getProductList(params), {
  defaultParams: {
    page: 1,
    perPage: 10,
  },
});
```

Or you can set the default params by using `setFetchOptions` method.

```tsx
import { setFetchOptions } from '@mongez/react-hooks';

setFetchOptions({
  defaultParams: {
    page: 1,
    perPage: 10,
  }
});
```

Here is the entire available options

```ts
type FetcherOptions = {
  defaultParams?: Record<string, any>; // the default params that will be passed to the fetcher method on each request beside the current params
  // the keys that will be taken from the `response.data` object and will be used as the output
  // it supports dot notation like `paginationInfo.currentPage` or `meta.totalRecords`
  keys?: {
    records?: string;
    itemsPerPage?: string;
    currentPage?: string;
    totalPages?: string;
    totalRecords?: string;
    currentRecords?: string;
    pageNumber?: string;
  };
};
```

You can see the entire documentation of usage in our article in [Dev.to](https://dev.to/hassanzohdy/usefetcher-the-easiest-way-to-fetch-data-in-react-45o9)

## Request Caching

If you're using `useRequest` or `useFetcher` hooks, you can cache the request by passing `expiresAt` option to the `useRequest` or `useFetcher` hooks.

```tsx
import { useRequest } from '@mongez/react-hooks';

export function HelloWorld() {
  const { response, loading, error } = useRequest(() => getUserData(), {
    expiresAt: 1000 * 60, // 1 minute
    cacheKey: 'hello', // the cache key
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{response.data.title}</div>;
}
```

This applies also to `useFetcher` hook, by setting `expiresAt` to number of milliseconds the response will be cached for that time, by default it will be 5 minutes `5 * 1000`, if sets to Zero (`0`), then the response will never be cached.

> You should always pass a `cacheKey` to fetch options to avoid conflicts with other requests, it can be for example record id.

> If you want to cache the response forever, you can set `expiresAt` to `Infinity`.

You can also set the default expiration time by using `setFetchOptions` method.

```tsx
import { setFetchOptions } from '@mongez/react-hooks';

setFetchOptions({
  expiresAt: 1000 * 60, // 1 minute , or set it to zero if you want to disable caching
});
```

> The response is cached on memory, meaning that if you refresh the page, the cache will be cleared.

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

  return <>Child Component is: {internalDisabled ? 'Enabled' : 'Disabled'}</>;
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

  return <>Child Component is: {internalDisabled ? 'Enabled' : 'Disabled'}</>;
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

## useFormRows

> Added in v1.2.0

Sometimes form can get complex and you need to add multiple inputs in multiple rows, for example in a table to make user add product options, each option has its own price, things will be very messy to make such a table.

Luckily we have `useFormRows` hook to help you with that.

```tsx
import { useFormRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    })
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map({ key, data, delete }) => (
            <tr key={key}>
              <td>
                <input
                  defaultValue={data.option}
                  name="option"
                  placeholder="Option"
                />
              </td>
              <td>
                <input
                  defaultValue={data.price}
                  name="price"
                  placeholder="Price"
                />
              </td>
              <td>
                <button onClick={remove}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </>
  );
}
```

So basically the `useFormRows` hook will return an array of rows and a `addRow` callback, each row has a `key` which is a unique id for that row, `row` which is the actual row data and `delete` function to delete that row.

The delete function will be called automatically when the user clicks on the delete button and will cause a rerender.

We can also update the row, for example if we're working with controlled values using `update` function.

```tsx
import { useFormRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    })
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map({ key, data, delete, update }) => (
            <tr key={key}>
              <td>
                <input
                  value={data.option}
                  name="option"
                  placeholder="Option"
                  onChange={(e) => {
                    update({
                      ...data,
                      option: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <input
                  value={data.price}
                  name="price"
                  placeholder="Price"
                  onChange={(e) => {
                    update({
                      ...data,
                      price: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <button onClick={remove}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </>
  );
}
```

The hook also provides you multiple hooks that you can listen to for any changes, `onAdd`, `onUpdate`, `onDelete` and `onChange`.

`onAdd` will be called when the user clicks on the add button, `onUpdate` will be called when the user updates a row, `onDelete` will be called when the user deletes a row and `onChange` will be called when any of the above happens.

```tsx
import { useFormRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    }),
    onAdd: (rowHandler, rowIndex, rows) => {
      console.log('New row added', row);
    },
    onUpdate: (rowHandler, rowIndex, rows) => {
      console.log('Row updated', row);
    },
    onDelete: (rowHandler, rowIndex, rows) => {
      console.log('Row deleted', row);
    },
    onChange: (rowHandler, state: 'add' | 'update' | 'delete' | rowIndex, rows) => {
      console.log('Rows changed', rows);
    }
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map({ key, data, delete, update }) => (
            <tr key={key}>
              <td>
                <input
                  value={data.option}
                  name="option"
                  placeholder="Option"
                  onChange={(e) => {
                    update({
                      ...data,
                      option: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <input
                  value={data.price}
                  name="price"
                  placeholder="Price"
                  onChange={(e) => {
                    update({
                      ...data,
                      price: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <button onClick={remove}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </>
  );
}
```

> Kindly note that the `rowHandler` that is passed to the `onAdd`, `onUpdate`, `onDelete` and `onChange` hooks is not that actual data, if you want to access it destruct it and get from `data` key.

If you would like to set update the rows later on, you can use `setRows` function.

```tsx
import { useFormRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow, setRows] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    })
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map({ key, data, delete, update }) => (
            <tr key={key}>
              <td>
                <input
                  value={data.option}
                  name="option"
                  placeholder="Option"
                  onChange={(e) => {
                    update({
                      ...data,
                      option: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <input
                  value={data.price}
                  name="price"
                  placeholder="Price"
                  onChange={(e) => {
                    update({
                      ...data,
                      price: e.target.value
                    });
                  }}
                />
              </td>
              <td>
                <button onClick={remove}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <button onClick={() => {
        setRows([
          {
            price: '100',
            option: 'Option 1'
          },
          {
            price: '200',
            option: 'Option 2'
          }
        ]);
      }}>Set Rows</button>
    </>
  );
}
```

## useCachedRows

> Added in v1.3.0

Using `useFormRows` will help you manage your rows in your form either in updating or deleting, the issue we might find here is each time the row is updated, it will cause a full re-render for the component that called `useFormRows`, the solution for this is to use `useCachedRows` hook.

`useCachedRows` will cache the rows in a state and will only update the row that is being updated, this will help you avoid re-rendering the whole component.

```tsx
import React from "react";
import { useFormRows, useCachedRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    }),
  });

  const rowCallback = ({ key, data, delete, update }) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={data.option}
            name="option"
            placeholder="Option"
            onChange={(e) => {
              update({
                ...data,
                option: e.target.value
              });
            }}
          />
        </td>
        <td>
          <input
            value={data.price}
            name="price"
            placeholder="Price"
            onChange={(e) => {
              update({
                ...data,
                price: e.target.value
              });
            }}
          />
        </td>
        <td>
          <button onClick={remove}>Remove</button>
        </td>
      </tr>      
    )
  });

  const cachedRows = useCachedRows(rows, rowCallback);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cachedRows}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </>
  );
}
```

Add `console.log` in the component and now update any value in any input, it will be printed only when adding or removing the row, but updating the row won't console anything!

Now when calling `update` it will only update that row, not the original row data, however you can also call `fullUpdate` instead, this will update the current row's value and update it as well in the rows list, which will cause a full re-render to the component.

```tsx
import React from "react";
import { useFormRows, useCachedRows } from "@mongez/react-hooks";

export function HelloWorld() {
  const [rows, addRow] = useFormRows({
    initial: [],
    addRow: () => ({
      price: '',
      option: ''
    }),
  });

  const rowCallback = ({ key, data, delete, fullUpdate }) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={data.option}
            name="option"
            placeholder="Option"
            onChange={(e) => {
              fullUpdate({
                ...data,
                option: e.target.value
              });
            }}
          />
        </td>
        <td>
          <input
            value={data.price}
            name="price"
            placeholder="Price"
            onChange={(e) => {
              fullUpdate({
                ...data,
                price: e.target.value
              });
            }}
          />
        </td>
        <td>
          <button onClick={remove}>Remove</button>
        </td>
      </tr>      
    )
  };

  const cachedRows = useCachedRows(rows, rowCallback);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cachedRows}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <button onClick={() => {
        updateRows({
          price: '100',
          option: 'Option 1'
        });
      }}>Update Rows</button>
    </>
  );
}
```

## Change Log

- 1.3.0 (27 Oct 2022)
  - Added `useCachedRows` hooks.
- 1.2.0 (27 Oct 2022)
  - Added `useFormRows` hooks.
- 1.1.0 (19 Oct 2022)
  - Added cache feature to `useRequest` and `useFetcher` hooks

## TODO

- Adding Unit Tests for hooks.
