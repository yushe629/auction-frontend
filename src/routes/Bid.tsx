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
const tokenId = 0;

export const Bid = () => {
  const { signer, nftList, setNftList } = useContext(Web3Context);
  // const classes = useStyles()

  const [targetNft, setTargetNft] = useState<Nft | null>(null);
  const [isGettingNftInfo, setIsGettingNftInfo] = useState(false);
  const getNft = async () => {
    setIsGettingNftInfo(true);
    const tmpNft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    setTargetNft(tmpNft);
    setIsGettingNftInfo(false);
  };

  console.log(nftList);

  return (
    <div>
      <h1 className="py-4">NFTに入札する</h1>
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
                100 tokenで
                <Button variant="contained">入札</Button>
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
