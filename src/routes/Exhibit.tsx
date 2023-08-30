import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
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

const alchemy = new Alchemy(alchemySettings);

const contractAddress = "0xfa53f3f7e58885eea510ff2d8a040b2a8b9f041e";

type AuctionInput = {
  tokenId: number;
  biddingTime: number;
};

type FinishAuctionInput = {
  address: string
}

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

  const [isRefresh, setIsRefresh] = useState(false)
  const refresh = () => {
    setIsRefresh(true)
    setIsRefresh(false);
  }

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

  const formObj = useForm<FinishAuctionInput>()
  const onFinishSubmit: SubmitHandler<FinishAuctionInput> = async (data) => {
    await finishAuction(signer, data.address, )
  }


  const getList = async () => {
    console.log(await getAuctionList(signer))
  }
  return (
    <div>
      <h1 className="py-4">NFTを出品する</h1>
      {signer ? (
        <div>
          <Button onClick={getList}>list取得</Button>
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
            <Button type="submit">開始</Button>
          </form>

          <form onSubmit={formObj.handleSubmit(onFinishSubmit)}>
            <TextField {...formObj.register('address')} label="address"/>
            <Button type="submit">結果を見る</Button>
          </form>
          {/* <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> */}
        </div>
      ) : (
        <div>Please connect your wallet.</div>
      )}
    </div>
  );
};
