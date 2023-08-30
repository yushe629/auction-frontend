import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { nftList } from "../nftlist";

export const AuctionTable = () => {
  return (
    <TableContainer component={Paper} className="p-20">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">image</TableCell>
            <TableCell align="right">description</TableCell>
            <TableCell align="right">address</TableCell>
            <TableCell align="right">deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nftList.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right"><img src={row.metadata.image}/></TableCell>
              <TableCell align="right">{row.metadata.description}</TableCell>
              <TableCell align="right">{row.address}</TableCell>
              <TableCell align="right">{row.deadLine}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
