import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Alchemy, Nft } from "alchemy-sdk";
import { useContext, useMemo, useState } from "react";
import { alchemySettings } from "../config/alchemy";
import { Web3Context } from "../web3Context";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { ethers, ContractFactory } from "ethers";
import { contractAddressMap } from "../contracts";
import blindAuction from "../abi/BlindAuction.json";
import { finishAuction, generateAuction, getAuctionList } from "../functions";
// import sampleNftAbi from "../abi/sampleNftAbi.json"
import { AuctionTable } from "../AuctionTable";

const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";

type AuctionInput = {
  tokenId: number;
  biddingTime: number;
};

type FinishAuctionInput = {
  address: string;
};

export const Exhibit = () => {
  const {
    provider,
    signer,
    nftList,
    setNftList,
    auctionAddressList,
    setAuctionAddressList,
  } = useContext(Web3Context);
  // const classes = useStyles()

  const [isRefresh, setIsRefresh] = useState(false);
  const refresh = () => {
    setIsRefresh(true);
    setIsRefresh(false);
  };

  // const AuctionList = useMemo(async () => {
  //   return await getAuctionList(signer)
  // }, [signer])

  const { register, handleSubmit } = useForm<AuctionInput>();

  const onSubmit: SubmitHandler<AuctionInput> = async (data) => {
    const auction = await generateAuction(
      signer,
      data.tokenId,
      data.biddingTime
    );
    return auction;
  };

  const formObj = useForm<FinishAuctionInput>();
  const onFinishSubmit: SubmitHandler<FinishAuctionInput> = async (data) => {
    await finishAuction(signer, data.address);
  };

  const getList = async () => {
    console.log(await getAuctionList(signer));
  };
  return (
    <div>
      <h1 className="py-4">NFTを出品する</h1>
      {signer ? (
        <div>
          {/* <Button onClick={getList}>list取得</Button> */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                defaultValue={0}
                {...register("tokenId")}
                label="tokenId"
                type="number"
              />
              <TextField
                defaultValue={600}
                {...register("biddingTime")}
                label="biddingTime"
                type="number"
              />
              <Button variant="contained" type="submit">開始</Button>
            </form>
          </div>

          <div>
            <form onSubmit={formObj.handleSubmit(onFinishSubmit)} className="block">
              <TextField {...formObj.register("address")} label="address" />
              <Button type="submit" variant="contained">
                結果を見る
              </Button>
            </form>
          </div>
          <AuctionTable />
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
