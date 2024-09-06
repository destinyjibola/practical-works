import { Todo } from "@/types/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, updateTodo } from "./api";

export function useCreatetTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      alert("Todo Created")
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["todos"] })
        alert("Task Upated")
          // await queryClient.invalidateQueries({
          //   queryKey: ["todo", { id: variables.id }],
          // });
      }
    },
  });
}


export function useDeleteTodo(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:(id: number) => deleteTodo(id),
    onSuccess:() => {
   
    },
    
    onSettled: async(_, error)=>{
      if (error) {
        console.log(error)
      } else{
        await queryClient.invalidateQueries({queryKey:["todos"]})
        alert("Todo Delete")
      }
    }
  })
}
