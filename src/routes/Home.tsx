import { useContext } from "react";
import { Web3Context } from "../web3Context";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Faucet } from "../components/Faucet";

export const Home = () => {

  return (
    <div>
      <h1 className="py-4">Welcome to NFT Blind Auction!</h1>
      <div className="flex flex-col">
        <Button>
          <Link className="text-xl w-full h-full" to="/Exhibit">Create Auction</Link>
        </Button>
        <Button>
          <Link className="text-xl w-full h-full" to="/Bid">Bidding</Link>
        </Button>
        <Button>
          <Link className="text-xl w-full h-full" to="/Bid">Mint NFT</Link>
        </Button>
      </div>
      <Faucet />
    </div>
  );
};
