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
    onSuccess:(newTodo)=>{
      queryClient.setQueryData(['todos'],(oldTodos)=>{
         return [newTodo, ...oldTodos];
      })
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
      const previousTodos=queryClient.setQueryData(['todos'],(oldTodos)=>{
        return oldTodos.filter((todo)=>todo.id!==deletedId);
      })
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
      <section id="center">
        <ul>
          {data.map((todo)=>(
            <li key={todo.id}>{todo.title}
            <button onClick={()=>{deleteMutation.mutate(todo.id)}}>X</button>
            </li>
          ))}
        </ul>
        
        <form onSubmit={(e)=>{
          e.preventDefault();
          mutation.mutate(title)
        }}>
           <input value={title} onChange={(e)=>{
          setTitle(e.target.value)
        }}/>
        <button type="submit">Add</button>
          </form>
      </section>
    </>
  )
}

export default App
