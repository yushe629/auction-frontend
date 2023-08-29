import "./App.css";
import { Header } from "./components/Header";
import { Router } from "./router";

function App() {
  return (
    <>
        <div className="App">
          <Header />
          {/* <h1>react-router-V6</h1> */}
          <Router />
        </div>
    </>
  );
}

export default App;
