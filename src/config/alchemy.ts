import { Network } from "alchemy-sdk";

// 現状 sepolia上のコントラクトに紐づいている
// zamaを使う場合，contractですべて引っ張ってきて，ownerが一致するもののみフィルタする

export const alchemySettings = {
	apiKey : import.meta.env.ALCHEMY_API_KEY,
	network: Network.ETH_SEPOLIA,
}