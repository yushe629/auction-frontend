import { Network } from "alchemy-sdk";

export const alchemySettings = {
	apiKey : import.meta.env.ALCHEMY_API_KEY,
	network: Network.ETH_SEPOLIA,
}