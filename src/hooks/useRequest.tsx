import React from "react";
import useOnce from "./useOnce";
import { AxiosResponse } from "axios";
import { lastRequest } from "@mongez/http";

type StateType = {
  value: AxiosResponse<any, any> | null;
  error: null | AxiosResponse<any, any>;
  isLoading: boolean;
};

export default function useRequest(promiseFunction: () => Promise<any>): any {
  const [state, setState] = React.useState<StateType>({
    value: null,
    error: null,
    isLoading: true,
  });

  useOnce(() => {
    promiseFunction()
      .then((response: AxiosResponse) => {
        setState({
          value: response,
          isLoading: false,
          error: null,
        });
      })
      .catch((response) => {
        if (response.__CANCEL__ === true) return;

        setState({
          value: null,
          isLoading: false,
          error: response,
        });
      });

    let request: any;

    setTimeout(() => {
      request = lastRequest();
    }, 0);

    return () => request.abort();
  });

  return {
    response: state.value,
    error: state.error,
    isLoading: state.isLoading,
  };
}
