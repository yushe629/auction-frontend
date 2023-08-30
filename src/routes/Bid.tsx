import { Button, TextField } from "@mui/material";
import { Alchemy, Nft } from "alchemy-sdk";
import { ethers } from "ethers";
import { FhevmInstance } from "fhevmjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import encErc20Abi from "../abi/EncryptedERC20Abi.json";
import { alchemySettings } from "../config/alchemy";
import { contractAddressMap } from "../contracts";
import { Web3Context } from "../web3Context";


type NftSearchInput = {
  address: string;
  tokenId: string;
}


const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";
const tokenId = 0;

export const Bid = () => {
  const { signer, instance, getTokenSignature } = useContext(Web3Context);
  // const classes = useStyles()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NftSearchInput>();


  const [targetNft, setTargetNft] = useState<Nft | null>(null);
  const [isGettingNftInfo, setIsGettingNftInfo] = useState(false);
  const getNft = async () => {
    setIsGettingNftInfo(true);
    const tmpNft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    setTargetNft(tmpNft);
    setIsGettingNftInfo(false);
  };

  const onSubmit = async () => {
    await getNft()
  }

  const encryptedBid = async (amount: number) => {
    const address = contractAddressMap.EncryptedERC20
    // use readonly data
    const { signature, publicKey } = await getTokenSignature(address, signer.address)
    const encryptedAmount = instance.encrypt32(amount)
  
    const contract = new ethers.Contract(address, encErc20Abi, signer)
  
    const tx = await contract.mint(encryptedAmount);
    const receipt = await tx.wait();
    console.log(receipt)
  }


  return (
    <div>
      <h1 className="py-4">NFTに入札する</h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register("address")} />
          <TextField {...register("tokenId")} />
          <Button type="submit">検索</Button>
        </form>
      </div>
      {signer ? (
        <div>
          {targetNft ? (
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
          )}
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
