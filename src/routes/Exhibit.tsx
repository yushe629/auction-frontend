import { Button, TextField } from "@mui/material";
import { Alchemy, Nft } from "alchemy-sdk";
import { useContext, useState } from "react";
import { alchemySettings } from "../config/alchemy";
import { Web3Context } from "../web3Context";
import { SubmitHandler, useForm } from "react-hook-form";
import { ethers, ContractFactory } from "ethers";
import { contractAddressMap } from "../contracts";
import blindAuction from "../abi/BlindAuction.json"
// import sampleNftAbi from "../abi/sampleNftAbi.json"


const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";

export const Exhibit = () => {
  const { provider, signer, nftList, setNftList, auctionAddressList, setAuctionAddressList } = useContext(Web3Context);
  // const classes = useStyles()

  const [isGettingNftInfo, setIsGettingNftInfo] = useState(false);
  const getNftList = async () => {
    setIsGettingNftInfo(true);
    const ownerAddress = signer.address;
    const list = await alchemy.nft.getNftsForOwner(ownerAddress);
    const filltered = list.ownedNfts.filter(
      (nft) => nft.contract.address == contractAddress
    );
    const nftList = await Promise.all(
      filltered.map((nft) => {
        return alchemy.nft.getNftMetadata(contractAddress, nft.tokenId);
      })
    );
    setNftList(nftList);
    setIsGettingNftInfo(false);
  };

  // console.log(nftList);

  // const [result, setResult] = useState<any>("null")

  // const getBalanceOf = async () => {
  //   const contract = new ethers.Contract(contractAddress, sampleNftAbi, signer)
  //   // console.log(signer.address)
  //   // console.log(nftList[0].tokenId)
  //   // const arg = Number(nftList[0].tokenId)
  //   // const transaction = await contract.ownerOf(arg)
  //   const transaction = await contract.balanceOf(signer.address)
  //   setResult(transaction)
  //   console.log(result)
  // }

  // useMemoでauctionのリストを用意しておく

  const deployAuction = async () => {
    const baFactory = new ContractFactory(blindAuction.abi, blindAuction.bytecode, await provider.getSigner(signer.address));
    // sample value
    const c2 = await baFactory.deploy(signer.address, contractAddressMap.EncryptedERC20, 600, true);
    await c2.waitForDeployment();
    setAuctionAddressList([...auctionAddressList, await c2.getAddress()])
    return
  }

  return (
    <div>
      <h1 className="py-4">NFTを出品する</h1>

      {signer ? (
        <div>
          {nftList.length !== 0 ? (
            nftList.map((item: Nft, index: number) => (
              <div className="flex items-center justify-around" key={index}>
                <div className="max-w-sm">
                  <img src={item.rawMetadata?.image} alt="画像" className="max-w-full"/>
                </div>
                <div>{item.description}</div>
                <div>
                  <Button variant="contained" onClick={deployAuction}>出品</Button>
                </div>
              </div>
            ))
          ) : (
            <Button onClick={getNftList} disabled={isGettingNftInfo}>
              NFTの一覧を取得します
            </Button>
          )}
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
