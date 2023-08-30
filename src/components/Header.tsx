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
import { createInstance, initFhevm } from "fhevmjs";

const networkMap = new Map<string, string>([
  ["8009", "zama"],
  ["11155111", "sepolia"]
])

export const Header = () => {
  const [isProgress, setIsProgress] = useState(false);

  const { provider, signer, setSigner, setInstance } = useContext(Web3Context);

  const initInstance = async () => {
    const network = await provider.getNetwork();
    const chainId = +network.chainId.toString();
    let publicKey = localStorage.getItem(`fhepubkey${chainId}`);
    if (!publicKey) {
      publicKey = await provider.call({ from: null, to: '0x0000000000000000000000000000000000000044' });
      localStorage.setItem('fhepubkey', publicKey ?? "");
    }
    return createInstance({ chainId, publicKey: publicKey ?? "" });
  };

  const connectWallet = async () => {
    setIsProgress(true);
    setSigner(await provider.getSigner());
    await initFhevm();
    setInstance(await initInstance())
    setIsProgress(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="w-full">
      <AppBar position="sticky">
        <Toolbar className="flex justify-between">
          <Typography variant="h6" component="div" >
            <Link className="text-white" to="/">Home</Link>
          </Typography>
          {signer ? (
            // <Typography>connected {networkMap.get(window.ethereum.networkVersion)} </Typography>
            <Typography>walledAddress: {signer.address}</Typography>
          ) : (
            <Button
              color="inherit"
              onClick={connectWallet}
              disabled={isProgress}
            >
              connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
