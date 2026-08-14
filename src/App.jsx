import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';

async function fetchData(){
  const response=await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  const data=await response.json();
  return data;
}

async function addTodo(title){
  const response=await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title, completed: false, userId:1})
  });
  const data=await response.json();
  return data;
}

async function deleteTodo(id){
  const response=await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'DELETE'
  });
  // throw new Error('Delete failed');
  return id;
}

function App() { 

  const [title, setTitle]=useState('');
  const queryClient=useQueryClient();
  
  const {data, isLoading, isError}=useQuery({
    queryKey:['todos'],
    queryFn:fetchData,
    staleTime: 30000
  });
   
  const mutation=useMutation({
    mutationFn:addTodo,
    onSuccess: (newTodo) => {
  queryClient.setQueryData(['todos'], (oldTodos) => {
    return [newTodo, ...oldTodos];
  });
}
  })

  const deleteMutation=useMutation({
    mutationFn:deleteTodo,
    onSuccess:(deletedId)=>{
      queryClient.setQueryData(['todos'],(oldTodos)=>{
        return oldTodos.filter((todo)=>todo.id!==deletedId);
      })
    },
    onMutate:async(deletedId)=>{
      const previousTodos=queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'],(oldTodos)=>{
        return oldTodos.filter((todo)=>todo.id!==deletedId);
      })
      return {previousTodos};
    },
    onError:(err, deletedId, context)=>{
      queryClient.setQueryData(['todos'], context.previousTodos);
    }
  })

  if(isLoading){
    return <h1>Loading...</h1>
  }
  if(isError){
    return <h1>Error </h1>
  }

  return (
  <>
    <section id="center" className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Todos</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(title);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {data.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          >
            <span className="text-gray-700 text-sm">{todo.title}</span>
            <button
              onClick={() => {
                deleteMutation.mutate(todo.id);
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  </>
);
}

export default App
