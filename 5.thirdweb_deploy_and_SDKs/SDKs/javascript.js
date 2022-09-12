import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const sdk = new ThirdwebSDK('mumbai');
const contract = sdk.getNFTDrop('<YOUR-CONTRACT-ADDRESS>');

const walletAddress = '<YOUR-WALLET_ADDRESS>';
const balance = await contract.balanceOf(walletAddress);
console.log('My NFT balance is: ', balance.toNumber());

const unclaimedNFTs = await contract.getAllUnclaimed();
// const firstUnclaimedNFT = unclaimedNFTs[0].name;
console.log(
  'Unclaimed NFTS: ',
  unclaimedNFTs.map((item) => {
    return item.name;
  })
);

const tokenId = 0;
const nft = await contract.get(tokenId);
console.log('Metadata of tokenId 0:', nft);
