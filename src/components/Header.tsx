import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Web3Context } from "../web3Context";

export const Header = () => {
  const [isProgress, setIsProgress] = useState(false);

  const { provider, signer, setSigner } = useContext(Web3Context);

  const connectWallet = async () => {
    setIsProgress(true);
    setSigner(await provider.getSigner());
    setIsProgress(false);
  };

  // console.log(signer)

  return (
    <Box sx={{ flexGrow: 1 }} className="w-full">
      <AppBar position="sticky">
        <Toolbar className="flex justify-between">
          <Typography variant="h6" component="div" >
            <Link className="text-white" to="/">Home</Link>
          </Typography>
          {signer ? (
            <Typography>walletId: {signer.address}</Typography>
          ):(
            <Button
              color="inherit"
              onClick={connectWallet}
              disabled={isProgress}
            >
              connect wallet
            </Button>
          ) }
        </Toolbar>
      </AppBar>
    </Box>
  );
};
