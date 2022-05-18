import { duration } from "@material-ui/core";
import config from "./config";

export const mintNFT = async (
  nftContract,
  account,
  tokenURI,
  amount = 1,
  maximum = 1,
  tokenId
) => {
  if (nftContract) {
    const response = await nftContract.methods
      .mint(account, tokenId, amount, maximum, tokenURI, "0x00")
      .send({ from: account });
    return response;
  }
};

export const listSaleItem = async (
  marketContract,
  nftContract,
  account,
  tokenId,
  amount,
  price
) => {
  if (marketContract) {
    const allowed = await nftContract.methods
      .isApprovedForAll(
        account,
        config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID]
      )
      .call();

    if (!allowed) {
      await nftContract.methods
        .setApprovalForAll(
          config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID],
          true
        )
        .send({ from: account });
    }
    return await marketContract.methods
      .listItem(
        config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
        tokenId,
        amount,
        price,
        Math.floor(new Date().getTime() / 1000),
        "0x0000000000000000000000000000000000000000"
      )
      .send({ from: account });
  }
};

export const createAuction = async (
  auctionContract,
  nftContract,
  account,
  tokenId,
  amount,
  initialPrice,
  auctionDuration,
  royalty
) => {
  if (auctionContract) {
    const allowed = await nftContract.methods
      .isApprovedForAll(
        account,
        config.contract.Auction[process.env.REACT_APP_NETWORK_ID]
      )
      .call();

    if (!allowed) {
      await nftContract.methods
        .setApprovalForAll(
          config.contract.Auction[process.env.REACT_APP_NETWORK_ID],
          true
        )
        .send({ from: account });
    }
    return await auctionContract.methods.createAuction(
        config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
        tokenId,
        amount,
        initialPrice,
        0,
        auctionDuration,
        0,
        0,
        royalty || 0
      )
      .send({ from: account });
  }
};
