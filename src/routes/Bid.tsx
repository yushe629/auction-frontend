import { Button, TextField } from "@mui/material";
import { Alchemy, Nft } from "alchemy-sdk";
import { ethers } from "ethers";
import { FhevmInstance } from "fhevmjs";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import encErc20Abi from "../abi/EncryptedERC20Abi.json";
import { alchemySettings } from "../config/alchemy";
import { contractAddressMap } from "../contracts";
import { Web3Context } from "../web3Context";
import { bidToken, getAuctionResult } from "../functions";


type NftSearchInput = {
  address: string;
  tokenId: string;
}

type BidInput = {
  address: string;
  amount: number;
}

type ResultInput = {
  address: string;
}

const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";
const tokenId = 0;


const sampleAuctionList = [
  {address: "", image: "", name: ""}
]

export const Bid = () => {
  const { signer, instance, getTokenSignature } = useContext(Web3Context);
  // const classes = useStyles()

  const {
    register,
    handleSubmit,
    // reset,
    // formState: { errors },
  } = useForm<BidInput>();


  const formObj = useForm<ResultInput>()
  const onResultSubmit: SubmitHandler<ResultInput> = async (data) => {
    await getAuctionResult(instance, signer, data.address, getTokenSignature)
  }

  // const [targetNft, setTargetNft] = useState<Nft | null>(null);
  // const [isGettingNftInfo, setIsGettingNftInfo] = useState(false);
  // const getNft = async () => {
  //   setIsGettingNftInfo(true);
  //   const tmpNft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
  //   setTargetNft(tmpNft);
  //   setIsGettingNftInfo(false);
  // };


  const encryptedBid = async (amount: number) => {
    const address = contractAddressMap.EncryptedERC20
    // use readonly data
    const { signature, publicKey } = await getTokenSignature(address)
    const encryptedAmount = instance.encrypt32(amount)
  
    const contract = new ethers.Contract(address, encErc20Abi, signer)
  
    const tx = await contract.mint(encryptedAmount);
    const receipt = await tx.wait();
    console.log(receipt)
  }

  
  const onSubmit: SubmitHandler<BidInput> = async (data) => {
    await bidToken(instance, signer, Number(data.amount), data.address, getTokenSignature)
    // await encryptedBid(Number(data.amount))
  }

  return (
    <div>
      <h1 className="py-4">NFTに入札する</h1>
      {/* <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register("address")} />
          <TextField {...register("tokenId")} />
          <Button type="submit">検索</Button>
        </form>
      </div> */}
      {signer ? (
        <div>
          {/* {targetNft ? (
            <div className="flex items-center justify-around">
              <div className="max-w-sm">
                <img
                  src={targetNft.rawMetadata?.image}
                  alt="画像"
                  className="max-w-full"
                />
              </div>
              <div>{targetNft.description}</div>
              <div>
                1000 tokenで
                <Button variant="contained" onClick={() => { encryptedBid(1000) }}>入札</Button>
              </div>
            </div>
          ) : (
            <Button onClick={getNft} disabled={isGettingNftInfo}>
              指定したNFTを取得します
            </Button>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              defaultValue={0}
              {...register("address")}
              label="auctionAddress"
            />
            <TextField
              defaultValue={600}
              {...register("amount")}
              label="amount"
              type="number"
            />
            <Button type="submit">入札</Button>
          </form>

          <form onSubmit={formObj.handleSubmit(onResultSubmit)}>
            <TextField {...formObj.register('address')} label="address"/>
            <Button type="submit">結果を見る</Button>
          </form>
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
