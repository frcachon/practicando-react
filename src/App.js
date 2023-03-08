import './App.css';
import MyComponent from "./features/myComponent/MyComponent";
import { QueryClient, QueryClientProvider } from 'react-query'
import {Route, Routes} from "react-router-dom";
import Hola from "./features/hola/Hola";

const queryClient = new QueryClient()

function App() {
  return (
      <div className="App">
          <Routes>
              <Route path='/' element={ <MyComponent /> } />
              <Route path='/others' element={ <QueryClientProvider client={queryClient}> <Hola /> </QueryClientProvider>} />
          </Routes>
      </div>
  );
}

export default App;