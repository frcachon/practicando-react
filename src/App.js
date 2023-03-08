import './App.css';
import MyComponent from "./features/myComponent/MyComponent";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return (
      <div className="App">
          <QueryClientProvider client={queryClient}>
              <MyComponent />
          </QueryClientProvider>
      </div>
  );
}

export default App;
