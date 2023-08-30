import { Card, CardHeader, CardContent } from "@mui/material"
import { Link } from "react-router-dom"

// zama chainId: 8009

export const Faucet = () => {
    return (
        <Card className="Index">
        <CardHeader title="Faucet" subheader="Get some tokens !" />
        <CardContent>
          <p>
            If you want to interact with the devnet, you should&nbsp;
            <Link className="faucet" to="https://faucet.zama.ai/">
              get some tokens
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    )
}