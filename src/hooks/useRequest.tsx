import endpoint from "@mongez/http";
import { Obj } from "@mongez/reinforcements";
import { AxiosResponse } from "axios";
import React from "react";
import responseCacheManager from "../response-cache-manager";
import { FetcherOptions } from "../types";
import { getFetchOptions } from "./useFetcher";
import useOnce from "./useOnce";

type StateType = {
  value: AxiosResponse<any, any> | null;
  error: null | AxiosResponse<any, any>;
  isLoading: boolean;
};

export default function useRequest(
  fetcher: () => Promise<any>,
  fetchOptions: Pick<FetcherOptions, "expiresAfter"> = {}
): any {
  const [state, setState] = React.useState<StateType>({
    value: null,
    error: null,
    isLoading: true,
  });

  const updateSettings = (response: any) => {
    setState({
      value: response,
      isLoading: false,
      error: null,
    });
  };

  useOnce(() => {
    fetchOptions = Obj.merge(fetchOptions, getFetchOptions());
    const canBeCached = responseCacheManager.canBeCached(fetchOptions);

    let cacheKey = responseCacheManager.cacheKey(fetcher, fetchOptions);

    if (canBeCached) {
      const response = responseCacheManager.get(cacheKey);

      if (response) {
        return updateSettings(response);
      }
    }

    fetcher()
      .then((response: AxiosResponse) => {
        updateSettings(response);

        if (canBeCached) {
          responseCacheManager.set(cacheKey, response, fetchOptions);
        }
      })
      .catch((response) => {
        setState({
          value: null,
          isLoading: false,
          error: response,
        });
      });

    let request: endpoint.getLastRequest;

    return () => request?.abort && request.abort();
  });

  return {
    response: state.value,
    error: state.error,
    isLoading: state.isLoading,
  };
}
