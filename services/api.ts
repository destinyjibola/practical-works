import { Todo } from "@/types/todos";
import axios from "axios";

const BASE_URL = "https://66ba1fd9fa763ff550fae3ce.mockapi.io";
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const getTodosIds = async (page: number = 1) => {
  return (await axiosInstance.get<Todo[]>(`todos?page=${page}&limit=5`)).data;
};

export const getNewTodos = async ({pageParam}: {pageParam: number}) => {
  // console.log(pageParam)
  return (await axiosInstance.get<Todo[]>(`todos?page=${pageParam}`)).data;
};

export const getTodosLazyLoading = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  return (
    await axiosInstance.get<Todo[]>(`todos?page=${pageParam + 1}&limit=5`)
  ).data;
};

export const createTodo = async (data: Todo) => {
  return await axiosInstance.post<Todo[]>("todos", data);
};

export const updateTodo = async (data: Todo) => {
  return await axiosInstance.put<Todo[]>(`todos/${data.id}`, data);
};

export const deleteTodo = async (id: number) => {
  return await axiosInstance.delete(`todos/${id}`);
};
