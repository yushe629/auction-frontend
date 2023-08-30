import { useContext } from "react";
import { Web3Context } from "../web3Context";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Faucet } from "../components/Faucet";

export const Home = () => {

  return (
    <div>
      <h1 className="py-4">Welcome to Blind NFT Auction!</h1>
      <div className="flex flex-col">
        <Button>
          <Link className="text-xl w-full h-full" to="/Exhibit">出品</Link>
        </Button>
        <Button>
          <Link className="text-xl w-full h-full" to="/Bid">入札</Link>
        </Button>
      </div>
      <Faucet />
    </div>
  );
};
