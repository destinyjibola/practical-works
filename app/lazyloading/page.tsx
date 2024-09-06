"use client";
import { useNewTodo, useTodoLazy } from "@/services/queries";
import { Todo } from "@/types/todos";
import React, { Fragment } from "react";

const LazyLoading = () => {
  const query = useTodoLazy();

  const renderlist = () => {
    if (query.isPending) {
      return <span className="m-4 text-gray-500">Loading...</span>;
    }
    if (query.isError) {
      return <span className="m-4 text-red-500">{query.error.message}</span>;
    }
    return (
      <ul>
        {query.data.pages.map((group, index) => (
          <Fragment key={index}>
            {group.map((item, index) => (
              <li
                key={item.id}
                className={`p-3 border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-900 text-white"
                }`}
              >
                <span className="mr-2">{item.id}</span> <strong>Title</strong>{" "}
                {item.title}
                {" ,"} <strong>Description</strong> {item.description}{" "}
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="m-8">
        <h2 className="font-bold underline">Todo List</h2>
        <ul className="list-none p-0">{renderlist()}</ul>
        <button
          className="mt-4 bg-black text-white p-2 rounded"
          onClick={() => query.fetchNextPage()}
          disabled={!query.hasNextPage || query.isFetchingNextPage}
        >
          {query.isFetchingNextPage
            ? "Loading more..."
            : query.hasNextPage
            ? "Load more"
            : "Noting more to load"}
        </button>
      </div>
    </>
  );
};

export default LazyLoading;
