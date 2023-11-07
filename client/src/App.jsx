import { EthProvider } from "./contexts/EthContext";
import AddLivretComponent from "./components/AddLivretComponent";
import ListeLivretsComponent from "./components/ListeLivretsComponent";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <AddLivretComponent />
          <hr />
          <ListeLivretsComponent />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;


