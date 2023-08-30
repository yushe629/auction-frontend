import { Nft } from "alchemy-sdk";
import { BrowserProvider, ethers } from "ethers";
import { FhevmInstance } from "fhevmjs";
import { createContext, useContext, useState } from "react";

type web3ContextProps = {
  count: number;
  setCount: (arg: number) => void;
  contractAddress: string;
  setContractAddress: (arg: string) => void;
  provider: BrowserProvider
  signer: ethers.JsonRpcSigner | null;
  setSigner: (arg: ethers.JsonRpcSigner) => void;
  nftList: Nft[];
  setNftList: (arg: Nft[]) => void;
  instance: FhevmInstance;
  setInstance: (arg: FhevmInstance) => void;
  getTokenSignature: (arg: string) => Promise<{ publicKey: Uint8Array, signature: string }>
}

export const Web3Context = createContext<web3ContextProps | null>(null);

export function Web3ContextProvider(props: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const browserProvider = new BrowserProvider(window.ethereum)

  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)

  const [contractAddress, setContractAddress] = useState("")

  const [nftList, setNftList] = useState<Nft[]>([])

  const initInstanceObject = {} as FhevmInstance;
  const [instance, setInstance] = useState<FhevmInstance>(initInstanceObject)
  const getTokenSignature = async (contractAddress: string) => {
    if (instance.hasKeypair(contractAddress)) {
      return instance.getTokenSignature(contractAddress)!;
    } else {
      const { publicKey, token } = instance.generateToken({ verifyingContract: contractAddress });
      const params = [signer?.address, JSON.stringify(token)];
      const signature: string = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });
      instance.setTokenSignature(contractAddress, signature);
      return { signature, publicKey };
    }
  };

  const [auctionAddressList, setAuctionAddressList] = useState<string[]>([])

  const value: web3ContextProps = {
    count,
    setCount,
    provider: browserProvider,
    contractAddress,
    setContractAddress,
    signer,
    setSigner,
    nftList,
    setNftList,
    instance,
    setInstance,
    getTokenSignature, auctionAddressList, setAuctionAddressList
  };

  return (
    <Web3Context.Provider value={value}>{props.children}</Web3Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeb3Context() {
  return useContext(Web3Context);
}
