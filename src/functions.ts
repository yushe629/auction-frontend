// コントラクトを叩く関数をまとめて定義しておく。
// contract: erc20, erc721, core, auction721 auction

import { FhevmInstance } from "fhevmjs";
import { contractAddressMap } from "./contracts";
// import { getTokenSignature } from "./wallet";
import { ethers } from "ethers";
import Adam721Abi from "./abi/Adam721LikeAbi.json";
import encErc20Abi from "./abi/EncryptedERC20Abi.json";
import Erc721AuctionAbi from "./abi/Erc721AuctionAbi.json";
import PlatformAbi from "./abi/PlatformCoreAbi.json";
import dayjs from "dayjs";

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
  setStatus: (arg: {text:string, severity: string}) => void
) => {
  const contractAddress = contractAddressMap.EncryptedERC20;
  await getTokenSignature(contractAddress);

  const encryptedAmount = instance.encrypt32(amount);
  const ercContract = new ethers.Contract(contractAddress, encErc20Abi, signer);

  // mint erc20
  setStatus({text: "minting EncryptedERC20 token", severity:"info"})
  const tx = await ercContract.mint(encryptedAmount);
  await tx.wait();
  setStatus({text: "minting EncryptedERC20 token completed", severity:"success"})

  setStatus({text: "approve EncryptedERC20 token", severity:"info"})

  // approve erc20
  const tx2 = await ercContract.approve(auctionAddress, encryptedAmount);
  await tx2.wait();
  setStatus({text: "approve EncryptedERC20 token completed", severity:"success"})


  // bid at auction contract
  await getTokenSignature(auctionAddress);
  const encValue = instance.encrypt32(amount)
  setStatus({text: "bidding EncryptedERC20 token", severity:"info"})
  const c2 = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer);
  const tx3 = await c2.bid(encValue);
  const r3 = await tx3.wait();
  setStatus({text: "bidding EncryptedERC20 token completed", severity:"success"})

  return r3;
};

export const getBidStatus = async (
  instance: FhevmInstance,
  signer: ethers.JsonRpcSigner,
  auctionAddress: string,
  getTokenSignature: (arg: string) => Promise<{ publicKey: Uint8Array, signature: string }>,
  setStatus: (arg: {text: string, severity: string}) => void
) => {
  const contractAddress = contractAddressMap.EncryptedERC20;
  const {publicKey, signature} = await getTokenSignature(contractAddress);

  const c = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer);
  const result = await c.getBid(publicKey, signature);
  const decoded = instance.decrypt(contractAddress, result)

  console.log(decoded)
  return decoded

}

export const getAuctionResult = async (
  instance: FhevmInstance,
  signer: ethers.JsonRpcSigner,
  auctionAddress: string,
  getTokenSignature: (arg: string) => Promise<{ publicKey: Uint8Array, signature: string }>,
  setStatus: (arg: {text: string, severity: string}) => void
) => {
  // const contractAddress = contractAddressMap.EncryptedERC20;
  const { publicKey, signature } = await getTokenSignature(
    auctionAddress,
  );

  // doIHaveHighestBid at auction contract
  // const c2 = new ethers.Contract(auctionAddress, blindAuctionAbi, signer);
  // using nft auction
  setStatus({text: "requesting doIHaveHighestBid", severity: "info"})
  const c2 = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer);
  const tx3 = await c2.doIHaveHighestBid(publicKey, signature);
  setStatus({text: "requesting doIHaveHighestBid completed", severity: "success"})


  const result = instance.decrypt(auctionAddress, tx3);
  
  console.log(result)

  if (result === 1) {
    setStatus({text: "Your bid was highest. Now claiming.", severity: "info"})
    const tx = await c2.claim();
    await tx.wait();
    setStatus({text: "Claiming was completed", severity: "success"})
    // console.log("win")
	// return instance.decrypt(contractAddress, r);
  } else {
    setStatus({text: "Your bid was not highest. Now Withdrawing", severity: "info"})
    const tx = await c2.withdraw();
    await tx.wait();
    setStatus({text: "Withdrawing was completed", severity: "success"})
    // console.log("lose")
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
  biddingTime: number,
  setStatus: (arg: {text: string, severity: string}) => void
) => {
  const c = new ethers.Contract(
    contractAddressMap.PlatformCore,
    PlatformAbi,
    signer
  );
  setStatus({text: "registering Auction", severity:"info"})
  // auctionType is 0: first-price and isStoppable is false.
  const tx = await c.registerAuction(tokenId, 0, biddingTime, false);
  await tx.wait();
  
  
  // const last = await c.getAuctionNum(ownerAddress)
  // console.log(last)
  const auctionAddress = await c.auctionsList(ownerAddress, 0)
  console.log(auctionAddress)
  const auctionContract = new ethers.Contract(auctionAddress, Erc721AuctionAbi, signer)
  const unixtime = await auctionContract.endTime()
  const deadLine = new Date(Number(unixtime) * 1000).toLocaleString()
  setStatus({text: `registered Auction. Auction address is ${auctionAddress}, deadLine: ${deadLine}`,  severity:"success"})
  
  // approve nft to auction
  setStatus({text: `Auction address is ${auctionAddress}, deadLine: ${deadLine}. now approving NFT`, severity:"info"})
  const nftContract = new ethers.Contract(contractAddressMap.Adam721Like, Adam721Abi, signer)
  const approveTx = await nftContract.approve(auctionAddress, tokenId);
  const result = await approveTx.wait();
  setStatus({text: `Auction address is ${auctionAddress}., deadLine: ${deadLine} approving was completed.`, severity:"success"})


  return result;

};

export const finishAuction = async (
	signer: ethers.JsonRpcSigner,
	auctionAddress: string,
  setStatus: (arg: {text: string, severity: string}) => void
) => {
	const c = new ethers.Contract(
		auctionAddress, Erc721AuctionAbi, signer
	)
  setStatus({text: "Finishing Auction", severity: "info"})

	const tx = await c.auctionEnd()
	const r = await tx.wait()
  setStatus({text: "Finishing Completed", severity: "success"})

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