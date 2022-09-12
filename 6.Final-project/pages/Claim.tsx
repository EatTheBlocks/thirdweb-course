import {
  useMetamask,
  useAddress,
  useContractMetadata,
  useEditionDrop,
  // useClaimNFT,
  useClaimedNFTs,
  ThirdwebNftMedia,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { Button } from 'antd';

const Claim: NextPage = () => {
  const connectMetamask = useMetamask();
  const address = useAddress();
  const ContractAddress = '<YOUR-CONTRACT-ADDRESS>';
  const editionDrop = useEditionDrop(ContractAddress);

  // get contract metadata
  const {
    data: contractMetadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useContractMetadata(ContractAddress);

  // // React SDK useClaimNFT
  // const {
  //   mutate: claimNft,
  //   isLoading: isClaiming,
  //   error: claimingError,
  // } = useClaimNFT(editionDrop);

  // useClaimedNFTs
  const { data: claimedNFTs } = useClaimedNFTs(editionDrop, {
    start: 0,
    count: 100,
  });

  // useOwnedNFTS
  const { data: ownedNFTs } = useOwnedNFTs(editionDrop, address);

  //set claim phase
  async function setClaimPhase() {
    const presaleStartTime = new Date();
    const publicSaleStartTime = new Date(Date.now() + 10 * 1000); //10 seconds from now
    const claimConditions = [
      {
        startTime: presaleStartTime, // start the presale now
        maxQuantity: 'unlimited', // limit how many mints for this presale
        price: 0.0, // presale price
        snapshot: ['0x51dE42454f3A50848e65bEDE6141Db788a9bCc5D'], // limit minting to only certain addresses
      },
      {
        startTime: publicSaleStartTime,
        price: 0.0, // public sale price
      },
    ];

    const tokenId = 2; // the id of the NFT to set claim conditions on
    await editionDrop?.claimConditions.set(tokenId, claimConditions);

    alert('New phase set');
  }

  //claim an NFT
  async function claimNFT() {
    const tokenId = 1;
    const qty = 1;
    if (!address) {
      connectMetamask();
      return;
    }
    try {
      const tx = await editionDrop?.claimTo(address, tokenId, qty);
      const receipt = tx?.receipt;
      console.log('NFT claim receipt:', receipt);
      alert('NFT claim successful');
    } catch (e) {
      alert('NFT claim unsuccessful');
      console.log(e);
    }
  }

  return (
    <div className={styles.container}>
      {address && <Button type="primary">Connected!</Button>}
      {!address && <Button onClick={connectMetamask}>Connect Wallet</Button>}
      <h3>My wallet address: {address}</h3>
      <div>Contract name: {contractMetadata?.name}</div>
      <div>Contract description: {contractMetadata?.description}</div>
      <img
        src={contractMetadata?.image}
        style={{ marginTop: 20, width: 250, height: 200 }}
      />

      <Button
        style={{ marginTop: 20 }}
        onClick={async () => {
          const owned = await editionDrop?.getOwned(address);
          let qty = 0;
          owned?.map((item) => {
            qty = item.quantityOwned.toNumber() + qty;
            return qty;
          });
          console.log('I own %s NFT(s)', qty);
        }}
      >
        Console.log owned NFTs
      </Button>

      <Button onClick={claimNFT} style={{ marginTop: 20 }}>
        Claim NFT
      </Button>

      <Button onClick={setClaimPhase} style={{ marginTop: 20 }}>
        Set Phase
      </Button>

      <Button
        onClick={async () => {
          const tokenId = 1;
          const amount = 1;
          try {
            await editionDrop?.burnTokens(tokenId, amount);
            alert('Burn successful');
          } catch (e) {
            console.log(e);
            alert('Burn unsuccessful');
          }
        }}
        style={{ marginTop: 20 }}
      >
        Burn NFT
      </Button>

      {claimedNFTs && claimedNFTs?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {claimedNFTs.map((nft: any) => (
            <div key={nft?.metadata?.id?.toString()}>
              <h3>
                {nft?.supply?.toNumber()} {nft?.metadata?.name} claimed
              </h3>
            </div>
          ))}
        </div>
      )}

      {ownedNFTs && ownedNFTs?.length > 0 && (
        <div className={styles.cards}>
          {ownedNFTs.map((nft: any) => (
            <div key={nft?.metadata?.id?.toString()} className={styles.card}>
              <h1>
                {nft?.quantityOwned?.toNumber()} {nft?.metadata.name}
              </h1>
              <ThirdwebNftMedia
                metadata={nft?.metadata}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Claim;
