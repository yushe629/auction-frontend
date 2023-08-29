import { Button } from "@mui/material";
import { Alchemy, Nft } from "alchemy-sdk";
import { useContext, useState } from "react";
import { alchemySettings } from "../config/alchemy";
import { Web3Context } from "../web3Context";


// const useStyles = makeStyles((theme) => ({
//   nftImg: {
//     objectFit: "cover",
//     maxWidth: "30vw",
//     display: "block"
//   },
// }));

const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";

export const Exhibit = () => {
  const { signer, nftList, setNftList } = useContext(Web3Context);
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

  console.log(nftList);

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
                  <Button variant="contained">出品</Button>
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
