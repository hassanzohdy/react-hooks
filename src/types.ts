import { AxiosResponse } from "axios";
import React from "react";

export type ResponseCache = {
  expiresAt: number;
  response: any;
};

export type CachedResponses = Record<string, ResponseCache>;

export type FetcherOptions = {
  defaultParams?: Record<string, any>;
  itemsPerPage?: number;
  /**
   * Cache Key
   */
  cacheKey?: string;
  /**
   * Determine if the response should be cached or not.
   *
   * If set to zero (0), the response will never be cached.
   * If set to a positive number, the response will be cached for that amount of milliseconds.
   * If set to Infinity, the response will be cached forever
   *
   * Please note that the response is cached in memory, so it will be lost when the browser page is refreshed or closed.
   *
   * @default 5 minutes (60 * 5000).
   */
  expiresAfter?: number;
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

export type FetcherOutput = {
  records: any[];
  error: null | any;
  load: (params?: Record<string, any>) => Promise<any>;
  reload: (params?: Record<string, any>) => Promise<any>;
  isLoading: boolean;
  loadMore: (params?: Record<string, any>) => Promise<any>;
  goToPage: (page: number) => Promise<any>;
  reset: () => Promise<any>;
  isLastPage: boolean;
  isFirstPage: boolean;
  currentPage: number;
  response?: AxiosResponse;
  totalPages: number;
  totalRecords: number;
  currentRecords: number;
  defaultParams: Record<string, any>;
  params: Record<string, any>;
  paginatable: boolean;
};

// useFormRows Hook types
export type FormRowsOptions = {
  /**
   * Initial rows
   */
  initial?: any[];
  /**
   * this will be called when the addRow callback is called
   */
  addRow?: (rows: any[]) => any;
  /**
   * Called after the row is added
   */
  onAdd?: (mewRow: any, newRowIndex: number, rows: any[]) => void;
  /**
   * Called after the row is removed
   */
  onDelete?: (row: any, index: number, rows: any[]) => void;
  /**
   * Called on row change
   */
  onUpdate?: (row: any, index: number, rows: any[]) => void;
  /**
   * Called when row is added, updated or removed
   */
  onChange?: (
    row: any,
    state: "add" | "update" | "delete",
    index: number,
    rows: any[]
  ) => void;
};

export type RowHandler = {
  /**
   * Row data
   */
  data: any;
  /**
   * Row index
   */
  index: number;
  /**
   * Row unique key, use it as the key prop in the row component
   */
  key: string;
  /**
   * Remove the row callback, just pass it to the `onClick` prop or whatever you want
   */
  remove: () => void;
  /**
   * Update row data
   */
  update: (newData: any) => void;
};

// useCachedRows Hook types
export type CachedRowHandler = RowHandler & {
  fullUpdate: (newRows: any) => void;
};

export type CachedRowCallback = (
  rowHandler: CachedRowHandler
) => React.ReactNode;

export type CachedRowProps = {
  row: RowHandler;
  callback: CachedRowCallback;
};
