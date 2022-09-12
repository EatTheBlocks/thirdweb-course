require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'rinkeby',
  networks: {
    hardhat: {},
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/...',
      accounts: ['...'],
    },
  },
  etherscan: {
    apiKey: '...',
  },
  solidity: '0.8.10',
};
