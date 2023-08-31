import { useContext } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Router } from "./router";
import { Web3Context } from "./web3Context";
import { Alert } from "@mui/material";

function App() {
  const { status } = useContext(Web3Context);
  return (
    <>
      <div className="App">
        <Header />
        {status.text !== "" && (
          <Alert severity={status.severity} className="mx-20 my-4">
            {status.text}
          </Alert>
        )}
        {/* <h1>react-router-V6</h1> */}
        <Router />
      </div>
    </>
  );
}

export default App;
