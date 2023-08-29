import { useContext } from "react";
import { Web3Context } from "../web3Context";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export const Home = () => {
  const context = useContext(Web3Context);

  return (
    <div>
      <h1>Welcome to Blind NFT Auction!</h1>
      <div>
        <Button>
          <Link to="/Exhibit">Exhibit</Link>
        </Button>
        <Button>
          <Link to="/Bid">Bid</Link>
        </Button>
      </div>
      <div>count: {context?.count}</div>
      <Button
        onClick={() => {
          context?.setCount(context.count + 1);
        }}
      >
        increment
      </Button>
    </div>
  );
};
