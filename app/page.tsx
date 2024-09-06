"use client";

import { useState } from "react";
import { useTodos } from "@/services/queries";
import {
  useCreatetTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "@/services/mutations";
import { Todo } from "@/types/todos";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const { data, isPending, isError, refetch, isPlaceholderData, isFetching } =
    useTodos(page);
  const { register, handleSubmit } = useForm<Todo>();
  const createTodoMutation = useCreatetTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleCreateTodo: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkasDoneSubmit = (data: Todo) => {
    setUpdatingTodoId(data.id); // Set the current updating todo ID
    updateTodoMutation.mutate(
      { ...data, checked: true },
      {
        onSuccess: () => {
          // Update the local state of todos after successful mutation
          refetch(); // Refetch the todos to get the updated state from the server
          setUpdatingTodoId(null); // Reset after the mutation is done
        },
        onError: () => {
          setUpdatingTodoId(null); // Reset if there is an error
        },
      }
    );
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoId(id); // Set the current deleting todo ID
    deleteTodoMutation.mutate(id, {
      onSuccess: () => {
        // Invalidate the todos query to refetch updated data
        // todoQuery.refetch(); // Refetch the todos to get the updated state from the server
        setDeletingTodoId(null); // Reset after the mutation is done
      },
      onError: () => {
        setDeletingTodoId(null); // Reset if there is an error
      },
    });
  };

  const renderTodoList = () => {
    if (isPending) {
      return <span className="m-4 text-gray-500">Loading...</span>;
    }
    if (isError) {
      return <span className="m-4 text-red-500">There is an error</span>;
    }

    return ( 
      <>
        <ul>
          {data.map((item: Todo, index: number) => (
            <li
              key={item.id}
              className={`p-3 border-b ${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              }`}
            >
              <span className="mr-2">{item.id }</span> <strong>Title</strong>{" "}
              {item.title}
              {" ,"} <strong>Description</strong> {item.description}{" "}
              <button
                className="text-white bg-black mr-2 rounded p-1"
                onClick={() => handleMarkasDoneSubmit(item)}
                disabled={item.checked || updatingTodoId === item.id}
              >
                {updatingTodoId === item.id
                  ? "Updating Todo"
                  : item.checked
                  ? "Done"
                  : "Mark as done"}
              </button>
              <button
                className="bg-red-700 text-white rounded p-1"
                onClick={() => handleDeleteTodo(item.id)}
                disabled={deletingTodoId === item.id}
              >
                {deletingTodoId === item.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2 mt-6">
          <span className="font-bold">Currrent page: {page}</span>
          <button
            className="text-white bg-black"
            onClick={() => {
              setPage((old) => old - 1);
            }}
          >
            Previous page
          </button>
          <button
            className="text-white bg-black"
            onClick={() => {
              if (!isPlaceholderData) {
                setPage((old) => old + 1);
              }
            }}
          >
            Next page
          </button>
          <span>{isFetching ? "Loading..." : null}</span>
        </div>
      </>
    );
  };

  return (
    <div className="m-8">
      <div className="">
        <form
          className="space-y-4 flex flex-col items-center w-[300px] p-4 border border-gray-300 rounded-lg shadow-sm"
          onSubmit={handleSubmit(handleCreateTodo)}
        >
          <h4 className="text-xl font-semibold mb-2">New Todo</h4>
          <input
            className="w-full px-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Title"
            {...register("title")}
          />
          <input
            className="w-full px-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Description"
            {...register("description")}
          />
          <input
            type="submit"
            disabled={createTodoMutation.isPending}
            value={createTodoMutation.isPending ? "Creating..." : "Create todo"}
            className={`w-full py-2 bg-gray-800 text-white rounded hover:bg-slate-600 transition duration-200 ease-in-out disabled:bg-gray-400 ${
              createTodoMutation.isPending
                ? "cursor-progress"
                : "cursor-pointer"
            }`}
          />
        </form>
      </div>

      <h2 className="mt-4 font-bold underline">Todo List</h2>
      <ul className="list-none p-0">{renderTodoList()}</ul>
    </div>
  );
}
