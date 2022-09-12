import { ConnectWallet, Web3Button, useAddress } from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { ethers } from 'ethers';

const Home: NextPage = () => {
  const address = useAddress();

  return (
    <div>
      {/* === CALL CONTRACT FROM WEB3 BUTTON === */}
      <Web3Button
        // The contract address
        contractAddress="<YOUR-CONTRACT-ADDRESS>"
        // ==== METHOD 1: Calling Contract Functions Directly ===
        // The name of the function to call on the contract
        functionName="balanceOf"
        // Some customization of the button style
        colorMode="light"
        accentColor="#F213A4"
        // The balanceOf Function on this contract accepts two parameters, //
        // my wallet address and the token ID I minted, you can add them in an array like so.
        params={[
          // add your parameters
          '<YOUR-WALLET-ADDRESS>',
          0,
        ]}
        // ==== METHOD 2: Using action to Access The Contract ===
        // action={(contract) =>
        //   contract.edition?.balanceOf(address, 0)
        // }

        // ===== GET A READABLE RESULT ======
        // If the function is successful, we can do something here.
        onSuccess={(result) =>
          console.log(ethers.BigNumber.from(result).toNumber())
        }
        // If the function fails, we can do something here.
        onError={(error) => console.error(error)}
      >
        Get NFT balance with thirdweb WEB3 Button
      </Web3Button>
    </div>
  );
};

export default Home;
