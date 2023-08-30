// コントラクトを叩く関数をまとめて定義しておく。
// contract: erc20, erc721, core, auction721 auction

import { FhevmInstance } from "fhevmjs";
import { contractAddressMap } from "./contracts";
// import { getTokenSignature } from "./wallet";
import { ethers } from "ethers";
import encErc20Abi from "./abi/EncryptedERC20Abi.json";
import blindAuctionAbi from "./abi/BlindAuctionAbi.json";
import Adam721Abi from "./abi/Adam721LikeAbi.json";
import PlatformAbi from "./abi/PlatformCoreAbi.json";
import Erc721AuctionAbi from "./abi/Erc721AuctionAbi.json";

/**
 * auction
 * bid, getBid, stop, onlyContractOwner, doIhaveHighesBid, claim, aucutionEnd, withdraw
 *
 * Player
 * bid()
 *
 * doIhaveHighestBid()
 * claim()
 * withdraw()
 *
 *
 * Owner
 * start
 * core.registerAuction()
 *
 * finish
 * auction.auctionEnded()
 *
 * stop
 * auction.stop()
 * refund()
 */

// bid
// mint erc20
// approve erc20 and

const ownerAddress = "0x37B04179693de0C0421295126647EB19B3f37d58"


export const bidToken = async (
  instance: FhevmInstance,
  signer: ethers.JsonRpcSigner,
  amount: number,
  auctionAddress: string,
  getTokenSignature: (arg: string) => Promise<{ publicKey: Uint8Array, signature: string }>,
  setStatusText: (arg: string) => void
) => {
  const contractAddress = contractAddressMap.EncryptedERC20;
  await getTokenSignature(contractAddress);
  const encryptedAmount = instance.encrypt32(amount);
  const ercContract = new ethers.Contract(contractAddress, encErc20Abi, signer);

  // mint erc20
  setStatusText("minting Encrypted ERC 20 token")
  const tx = await ercContract.mint(encryptedAmount);
  await tx.wait();
  setStatusText("minting Encrypted ERC 20 token")


  console.log("mint erc20 completed.")

  // approve erc20
  const tx2 = await ercContract.approve(auctionAddress, encryptedAmount);
  await tx2.wait();

  console.log("approve erc20 completed.")

  // bid at auction contract
  await getTokenSignature(auctionAddress)
  const encValue = instance.encrypt32(amount)
  const c2 = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer);
  const tx3 = await c2.bid(encValue);
  const r3 = await tx3.wait();

  console.log("bid completed")

  return r3;
};

export const getAuctionResult = async (
  instance: FhevmInstance,
  signer: ethers.JsonRpcSigner,
  auctionAddress: string,
  getTokenSignature: (arg: string) => Promise<{ publicKey: Uint8Array, signature: string }>
) => {
  const contractAddress = contractAddressMap.EncryptedERC20;
  const { publicKey, signature } = await getTokenSignature(
    contractAddress,
  );

  // doIHaveHighestBid at auction contract
  // const c2 = new ethers.Contract(auctionAddress, blindAuctionAbi, signer);
  // using nft auction
  const c2 = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer);
  const tx3 = await c2.doIHaveHighestBid(publicKey, signature);
  const r3 = await tx3.wait();

  const result = instance.decrypt(contractAddress, r3);

  if (result === 0) {
    const tx = await c2.claim();
    await tx.wait();
    console.log("win")
	// return instance.decrypt(contractAddress, r);
  } else {
    const tx = await c2.withdraw();
    await tx.wait();
    console.log("lose")
	// return instance.decrypt(contractAddress, r);
  }

  return result;

};

// exhibit
// generate auction
// auction ended

export const generateAuction = async (
  signer: ethers.JsonRpcSigner,
  tokenId: number,
  biddingTime: number
) => {
  const c = new ethers.Contract(
    contractAddressMap.PlatformCore,
    PlatformAbi,
    signer
  );
  // auctionType is 0: first-price and isStoppable is false.
  const tx = await c.registerAuction(tokenId, 0, biddingTime, false);
  await tx.wait();
  
  // const last = await c.getAuctionNum(ownerAddress)
  // console.log(last)
  const auctionAddress = await c.auctionsList(ownerAddress, 0)
  console.log(auctionAddress)

  // approve nft to auction
  const nftContract = new ethers.Contract(contractAddressMap.Adam721Like, Adam721Abi, signer)
  const approveTx = await nftContract.approve(auctionAddress, tokenId);
  const result = await approveTx.wait();

  return result;

};

export const finishAuction = async (
	signer: ethers.JsonRpcSigner,
	auctionAddress: string
) => {
	const c = new ethers.Contract(
		auctionAddress, Erc721AuctionAbi, signer
	)
	const tx = await c.auctionEnded()
	const r = await tx.wait()
	return r;
};

// for debug address
export const getAuctionList = async(
  signer: ethers.JsonRpcSigner,
) => {
  const coreContract = new ethers.Contract(
    contractAddressMap.PlatformCore, PlatformAbi, signer
  )
  const auctionSize = await coreContract.getAuctionNum(signer.address)
  console.log(auctionSize)

  const auctionAddressList = await Promise.all(Array.from(auctionSize).map(async (_,index) => {
    return await coreContract.auctionsList(ownerAddress, index)
  }))
  
  
  const erc721contract = new ethers.Contract(
    contractAddressMap.Adam721Like, Adam721Abi, signer
  )

  const auctionList = await Promise.all(auctionAddressList.map(async (address:string) => {
    const auctionContract = new ethers.Contract(
      address, Erc721AuctionAbi, signer
    )
    const tokenId = await auctionContract.targetTokenId()
    return {address, endTime: await auctionContract.endTime(), beneficiary: await auctionContract.beneficiary(), tokenURI: await erc721contract.tokenURI(tokenId) }
  }))
  return auctionList;
}