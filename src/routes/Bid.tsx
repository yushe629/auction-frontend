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
import { bidToken, getAuctionResult, getBidStatus } from "../functions";
import { AuctionTable } from "../AuctionTable";


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
  const { signer, instance, getTokenSignature, setStatus } = useContext(Web3Context);
  // const classes = useStyles()

  const {
    register,
    handleSubmit,
    // reset,
    // formState: { errors },
  } = useForm<BidInput>();


  const formObj = useForm<ResultInput>()
  const onResultSubmit: SubmitHandler<ResultInput> = async (data) => {
    await getAuctionResult(instance, signer, data.address, getTokenSignature, setStatus)

    // sample getBid
    // await getBidStatus(instance, signer, data.address, getTokenSignature, setStatusText)
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
    await bidToken(instance, signer, Number(data.amount), data.address, getTokenSignature, setStatus)
    // await encryptedBid(Number(data.amount))
  }

  return (
    <div>
      <h1 className="py-8">Bidding</h1>
      {/* <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register("address")} />
          <TextField {...register("tokenId")} />
          <Button type="submit">検索</Button>
        </form>
      </div> */}
      {signer ? (
        <div className="flex flex-col gap-4">
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
            <div className="flex justify-center gap-4 items-center">
              <div>オークションに入札</div>
            <TextField
              defaultValue={0}
              {...register("address")}
              label="auctionAddress"
            />
            <TextField
              defaultValue={1000}
              {...register("amount")}
              label="Token Amount"
              type="number"
            />
            <Button variant="contained" type="submit">入札</Button>
            </div>
            
          </form>

          <form onSubmit={formObj.handleSubmit(onResultSubmit)}>
            <div className="flex items-center gap-4 justify-center">
              <div>オークション結果を確認</div>
            <TextField {...formObj.register('address')} label="auctionAddress"/>
            <Button variant="contained" type="submit">確認</Button>

            </div>
          </form>
          <AuctionTable />
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
