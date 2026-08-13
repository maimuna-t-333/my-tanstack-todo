import { useQuery } from '@tanstack/react-query'

async function fetchData(){
  const response=await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  const data=await response.json();
  return data;
}

function App() { 
  
  const {data, isLoading, isError}=useQuery({
    queryKey:['todos'],
    queryFn:fetchData
  });

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
