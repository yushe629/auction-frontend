import { Alert } from "@mui/material";

export const StatusBar = ({children}) => {
  return (
    <>
      <Alert severity="info">{children}</Alert>
    </>
  );
};
