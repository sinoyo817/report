import {
    QueryClient,
    DefaultOptions,
    UseQueryOptions,
    UseMutationOptions,
    UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const queryConfig: DefaultOptions = {
    queries: {
        useErrorBoundary: false,
        refetchOnWindowFocus: false,
        retry: false,
    },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type QueryConfigType<TData> =
    | Omit<
          UseQueryOptions<TData, AxiosError, TData, string[]>,
          "queryFn" | "queryKey"
      >
    | undefined;

export type InfiniteQueryConfigType<TData> =
    | Omit<
          UseInfiniteQueryOptions<TData, AxiosError, TData, TData, string[]>,
          "queryFn" | "queryKey"
      >
    | undefined;

export type MutationConfigType<
    TData = unknown,
    TVariables = void,
    TContext = unknown,
    TAxiosError = unknown
> =
    | Omit<
          UseMutationOptions<
              TData,
              AxiosError<TAxiosError>,
              TVariables,
              TContext
          >,
          "mutationKey" | "mutationFn"
      >
    | undefined;
