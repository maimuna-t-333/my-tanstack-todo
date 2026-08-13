import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

function App() { 

  const queryClient=useQueryClient();
  
  const {data, isLoading, isError}=useQuery({
    queryKey:['todos'],
    queryFn:fetchData,
    staleTime: 30000
  });

  const mutation=useMutation({
    mutationFn:addTodo,
    onSuccess:()=>{
      console.log('added')
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
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default App
