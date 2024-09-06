import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { getNewTodos, getTodosIds, getTodosLazyLoading } from "./api";

export function useTodos(page: number) {
  return useQuery({
    queryKey: ["todos", { page }],
    queryFn: () => getTodosIds(page),
    placeholderData: keepPreviousData,
  });
}

export function useNewTodo() {
  return useInfiniteQuery({
    queryKey: ["newtodos"],
    queryFn: getNewTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPages, allPages) => {
      // console.log(lastPage,allPage)
      const nextPage = lastPages.length ? allPages.length + 1 : undefined;
      return nextPage 
    },
  });
}

export function useTodoLazy() {
  return useInfiniteQuery({
    queryKey: ["todoslazy"],
    queryFn: getTodosLazyLoading,
    initialPageParam: 0 ,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}
